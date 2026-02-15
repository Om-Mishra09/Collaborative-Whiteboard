import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import Whiteboard from './Whiteboard';

function App({ initialAuth }: { initialAuth: boolean }) {

  if (!initialAuth) {
    return <LandingPage />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/whiteboard/:sessionId" element={<Whiteboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;