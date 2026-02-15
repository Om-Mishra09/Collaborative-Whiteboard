import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import keycloak from '../keycloak';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [joinSessionId, setJoinSessionId] = useState('');
    const [userName, setUserName] = useState<string>('User');

    useEffect(() => {
        if (keycloak.tokenParsed) {
            const name = (keycloak.tokenParsed as any).name || (keycloak.tokenParsed as any).preferred_username || 'User';
            setUserName(name);
        }
    }, []);

    const createSession = () => {
        // Generate a random session ID using uuid
        const sessionId = uuid();
        navigate(`/whiteboard/${sessionId}`);
    };

    const joinSession = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinSessionId.trim()) {
            navigate(`/whiteboard/${joinSessionId.trim()}`);
        }
    };

    const handleLogout = () => {
        keycloak.logout();
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
                <div className="container">
                    <span className="navbar-brand fw-bold">Dentrite Whiteboard</span>
                    <div className="d-flex align-items-center text-white">
                        <span className="me-3">Hello, {userName}</span>
                        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container mt-5 flex-grow-1">
                <div className="text-center mb-5">
                    <h1 className="display-5 fw-bold text-dark">Welcome back, {userName}!</h1>
                    <p className="lead text-muted">Ready to collaborate? Choose an option below.</p>
                </div>

                <div className="row justify-content-center g-4">
                    {/* Create Session Card */}
                    <div className="col-md-5">
                        <div className="card h-100 shadow border-0 hover-shadow transition-all">
                            <div className="card-body text-center p-5">
                                <div className="mb-4 text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                    </svg>
                                </div>
                                <h3 className="card-title fw-bold mb-3">Create New Session</h3>
                                <p className="card-text text-muted mb-4">
                                    Start a fresh whiteboard session and invite others to join you instantly.
                                </p>
                                <button
                                    className="btn btn-primary btn-lg w-100 rounded-pill"
                                    onClick={createSession}
                                >
                                    Create Session
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Join Session Card */}
                    <div className="col-md-5">
                        <div className="card h-100 shadow border-0 hover-shadow transition-all">
                            <div className="card-body text-center p-5">
                                <div className="mb-4 text-success">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                    </svg>
                                </div>
                                <h3 className="card-title fw-bold mb-3">Join Existing Session</h3>
                                <p className="card-text text-muted mb-4">
                                    Enter a Session ID to jump into your team's ongoing collaboration.
                                </p>
                                <form onSubmit={joinSession}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control form-control-lg text-center bg-light border-0"
                                            placeholder="Enter Session ID"
                                            value={joinSessionId}
                                            onChange={(e) => setJoinSessionId(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg w-100 rounded-pill"
                                        disabled={!joinSessionId.trim()}
                                    >
                                        Join Session
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
