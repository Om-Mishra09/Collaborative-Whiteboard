import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface ChatProps {
    socket: Socket | null;
    roomId: string;
    username: string;
}

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: number;
}

const Chat: React.FC<ChatProps> = ({ socket, roomId, username }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message: Message) => {
            setMessages((prev) => [...prev, message]);
        };

        socket.on('receive-message', handleReceiveMessage);

        return () => {
            socket.off('receive-message', handleReceiveMessage);
        };
    }, [socket]);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        const messageData: Message = {
            id: Date.now().toString(),
            text: newMessage.trim(),
            sender: username,
            timestamp: Date.now(),
        };

        // Optimistically add message
        setMessages((prev) => [...prev, messageData]);

        // Send to server
        socket.emit('send-message', { roomId, message: messageData });

        setNewMessage('');
    };

    return (
        <div className="position-absolute bottom-0 end-0 m-3" style={{ zIndex: 1000, width: '300px' }}>
            {!isOpen && (
                <button
                    className="btn btn-primary rounded-circle shadow-lg p-3 float-end"
                    onClick={() => setIsOpen(true)}
                >
                    <i className="bi bi-chat-dots-fill fs-4"></i>
                </button>
            )}

            {isOpen && (
                <div className="card shadow-lg">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Room Chat</h6>
                        <button
                            className="btn btn-sm btn-link text-white text-decoration-none"
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <div className="card-body p-2 overflow-auto" style={{ height: '300px', backgroundColor: '#f8f9fa' }}>
                        {messages.length === 0 ? (
                            <div className="text-center text-muted mt-5">
                                <small>No messages yet. Say hello!</small>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`d-flex flex-column mb-2 ${msg.sender === username ? 'align-items-end' : 'align-items-start'}`}
                                >
                                    <div
                                        className={`p-2 rounded ${msg.sender === username ? 'bg-primary text-white' : 'bg-white border'}`}
                                        style={{ maxWidth: '80%' }}
                                    >
                                        <small className="d-block fw-bold mb-1" style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                                            {msg.sender === username ? 'You' : msg.sender}
                                        </small>
                                        <div className="text-break">{msg.text}</div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="card-footer p-2">
                        <form onSubmit={sendMessage} className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary btn-sm">
                                <i className="bi bi-send-fill"></i>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
