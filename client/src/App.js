import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Home from './components/home';
import SignUp from './components/signup';
import LogIn from './components/login';
import Group from './components/group';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/group/:id" element={<Group />} />
      </Routes>
    </Router>
  );
}

export default App;
