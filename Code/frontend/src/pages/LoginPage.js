import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import AnnouncementBox from '../components/AnnouncementBox';
import AdviceBox from '../components/AdviceBox';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [, setCookie] = useCookies(['user']);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      setCookie('user', data, { path: '/' });
      if (data.role === 'student') navigate('/student');
      else if (data.role === 'teacher') navigate('/teacher');
      else if (data.role === 'supervisor') navigate('/supervisor');
      else navigate('/dashboard');
    } catch (err) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="login-page">
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <AnnouncementBox />
        <AdviceBox />
      </div>
      <Box sx={{ direction: 'rtl', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6fa' }}>
        <Box component="form" onSubmit={handleLogin} sx={{ bgcolor: '#fff', p: 4, borderRadius: 2, boxShadow: 3, width: '100%', maxWidth: 380, mx: 2 }}>
          <Typography variant="h5" mb={2} fontWeight={700} align="center">تسجيل الدخول</Typography>
          <TextField
            label="اسم المستخدم"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            required
            margin="normal"
            inputProps={{ style: { fontFamily: 'inherit' } }}
          />
          <TextField
            label="كلمة المرور"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            inputProps={{ style: { fontFamily: 'inherit' } }}
          />
          <Button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 0, top: 0 }}>
            {showPassword ? 'إخفاء' : 'إظهار'}
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, fontWeight: 700 }}>دخول</Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link to="/register" style={{ marginLeft: 8 }}>تسجيل جديد</Link>
            |
            <Link to="/reset-password" style={{ marginRight: 8 }}>نسيت كلمة المرور؟</Link>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
export default LoginPage;
