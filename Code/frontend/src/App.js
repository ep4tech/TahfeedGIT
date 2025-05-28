import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import SupervisorPage from './pages/SupervisorPage';
import SupervisorSettingsPage from './pages/SupervisorSettingsPage';
import { useCookies } from 'react-cookie';

function App() {
  const [cookies] = useCookies(['user']);
  const user = cookies.user;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/student" element={user?.role === 'student' ? <StudentPage /> : <Navigate to="/" />} />
        <Route path="/teacher" element={user?.role === 'teacher' ? <TeacherPage /> : <Navigate to="/" />} />
        <Route path="/supervisor" element={user?.role === 'supervisor' ? <SupervisorPage /> : <Navigate to="/" />} />
      <Route path="/supervisor/settings" element={user?.role === 'supervisor' ? <SupervisorSettingsPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;
