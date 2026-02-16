import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { io, Socket } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import keycloak from './keycloak';
import Chat from './components/Chat';

const SOCKET_URL = 'http://localhost:4000';

const Whiteboard = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const roomId = sessionId; // Keep roomId for backward compatibility with socket events
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [username, setUsername] = useState<string>('User');
    const [chatOpen, setChatOpen] = useState(false);

    // History for Undo/Redo
    const [history, setHistory] = useState<string[]>([]);
    const [historyStep, setHistoryStep] = useState(-1);

    // Remote Cursors
    const cursorsRef = useRef<Map<string, fabric.Group>>(new Map());

    // Get Username
    useEffect(() => {
        if (keycloak.tokenParsed) {
            const name = (keycloak.tokenParsed as any).name || (keycloak.tokenParsed as any).preferred_username || 'User';
            setUsername(name);
        }
    }, []);

    useEffect(() => {
        if (!roomId) {
            navigate('/');
            return;
        }


        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.emit('join-room', roomId);

        const canvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: true,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 'white',
        });


        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = brushSize;

        setFabricCanvas(canvas);

        newSocket.on('draw-line', (data: any) => {
            fabric.util.enlivenObjects([data], (objects: any[]) => {
                objects.forEach((obj) => {
                    canvas.add(obj);
                });
                canvas.renderAll();
            }, 'fabric');
        });

        newSocket.on('clear', () => {
            canvas.clear();
            canvas.backgroundColor = 'white';
        });

        newSocket.on('cursor-move', ({ username: remoteUser, x, y, socketId }) => {
            if (!canvas) return;

            const cursors = cursorsRef.current;
            let cursor = cursors.get(socketId);

            if (!cursor) {
                const cursorText = new fabric.Text(remoteUser, {
                    fontSize: 12,
                    left: 10,
                    top: 0,
                    fill: 'white',
                    backgroundColor: getRandomColor(socketId),
                    originX: 'left',
                    originY: 'bottom'
                });

                const cursorIcon = new fabric.Circle({
                    radius: 5,
                    fill: getRandomColor(socketId),
                    left: 0,
                    top: 0
                });

                cursor = new fabric.Group([cursorIcon, cursorText], {
                    left: x,
                    top: y,
                    selectable: false,
                    evented: false,
                    originX: 'left',
                    originY: 'top'
                });

                canvas.add(cursor);
                cursors.set(socketId, cursor);
            } else {
                cursor.set({ left: x, top: y });
                cursor.setCoords();
            }

            canvas.renderAll();
        });

        const handleResize = () => {
            canvas.setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            newSocket.disconnect();
            canvas.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, [roomId, navigate]); 


    useEffect(() => {
        if (!fabricCanvas) return;
        fabricCanvas.freeDrawingBrush.color = color;
        fabricCanvas.freeDrawingBrush.width = brushSize;
    }, [color, brushSize, fabricCanvas]);

    // Initialize history with empty canvas state so Undo can revert to a blank canvas
    useEffect(() => {
        if (!fabricCanvas) return;
        if (history.length === 0) {
            const emptyState = JSON.stringify(fabricCanvas.toJSON());
            setHistory([emptyState]);
            setHistoryStep(0);
        }
    }, [fabricCanvas]);

    useEffect(() => {
        if (!fabricCanvas || !socket || !roomId) return;

        const handlePathCreated = (e: any) => {
            if (historyStep < history.length - 1) {
                history.length = historyStep + 1;
            }
            const json = JSON.stringify(fabricCanvas);
            setHistory([...history, json]);
            setHistoryStep(prev => prev + 1);

            const path = e.path;
            socket.emit('draw-line', { roomId, data: path.toJSON() });
        };

        const handleMouseMove = (opt: fabric.IEvent) => {
            if (!opt.pointer) return;
            socket.emit('cursor-move', {
                roomId,
                username,
                x: opt.pointer.x,
                y: opt.pointer.y
            });
        };

        fabricCanvas.on('path:created', handlePathCreated);
        fabricCanvas.on('mouse:move', handleMouseMove);

        return () => {
            fabricCanvas.off('path:created', handlePathCreated);
            fabricCanvas.off('mouse:move', handleMouseMove);
        };
    }, [fabricCanvas, socket, history, historyStep, roomId, username]);


    const getRandomColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    // --- Toolbar Actions ---

    const clearBoard = () => {
        if (fabricCanvas && socket && roomId) {
            fabricCanvas.clear();
            fabricCanvas.backgroundColor = 'white';
            socket.emit('clear', roomId);
        }
    };

    const saveImage = () => {
        if (fabricCanvas) {
            const dataURL = fabricCanvas.toDataURL({ format: 'png' });
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `whiteboard-session-${roomId}.png`;
            link.click();
        }
    };

    const savePDF = () => {
        if (fabricCanvas) {
            const imgData = fabricCanvas.toDataURL({ format: 'png' });
            const pdf = new jsPDF({
                orientation: 'landscape',
            });
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`whiteboard-session-${roomId}.pdf`);
        }
    };

    const undo = () => {
        if (fabricCanvas && historyStep > 0) {
            const prevStep = historyStep - 1;
            setHistoryStep(prevStep);
            fabricCanvas.loadFromJSON(history[prevStep], () => {
                fabricCanvas.renderAll();
                // Important: Re-enable drawing mode after loading JSON
                fabricCanvas.isDrawingMode = true;
            });
        }
    };

    const leaveSession = () => {
        navigate('/');
    };

    const logout = () => {
        keycloak.logout();
    };

    return (
        <div className="position-relative w-100 vh-100 overflow-hidden">
            {/* Toolbar */}
            <div className="position-absolute top-0 start-50 translate-middle-x mt-3 bg-light p-2 rounded shadow d-flex gap-2 align-items-center" style={{ zIndex: 10 }}>

                <button className="btn btn-outline-dark btn-sm" onClick={leaveSession} title="Back to Dashboard">
                    <i className="bi bi-arrow-left"></i> Back
                </button>

                <div className="vr mx-2"></div>

                <span className="badge bg-secondary me-2">Session: {roomId}</span>

                {/* Colors */}
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="form-control form-control-color"
                    title="Choose Color"
                />

                {/* Brush Size */}
                <select
                    className="form-select form-select-sm"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    style={{ width: '80px' }}
                >
                    <option value="2">Thin</option>
                    <option value="5">Normal</option>
                    <option value="10">Thick</option>
                    <option value="20">Marker</option>
                </select>

                <div className="vr mx-2"></div>

                {/* Tools */}
                <button className="btn btn-outline-secondary btn-sm" onClick={undo} disabled={historyStep <= 0}>Undo</button>
                <button className="btn btn-outline-danger btn-sm" onClick={clearBoard}>Clear</button>

                <div className="dropdown d-inline-block">
                    <button className="btn btn-primary btn-sm dropdown-toggle" type="button" id="exportDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        Export
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="exportDropdown">
                        <li><button className="dropdown-item" onClick={saveImage}>Save as PNG</button></li>
                        <li><button className="dropdown-item" onClick={savePDF}>Save as PDF</button></li>
                    </ul>
                </div>

                <div className="vr mx-2"></div>

                <button className="btn btn-dark btn-sm" onClick={logout}>Logout</button>
            </div>

            {/* Canvas */}
            <canvas ref={canvasRef} />

            {/* Chat Component */}
            <Chat
                socket={socket}
                roomId={roomId || ''}
                username={username}
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                onOpen={() => setChatOpen(true)}
            />
        </div>
    );
};

export default Whiteboard;