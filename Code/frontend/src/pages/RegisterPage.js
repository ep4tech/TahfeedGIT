import React, { useState } from 'react';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('student');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    if (password !== confirm) {
      setStatus('كلمتا المرور غير متطابقتين');
      return;
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      if (!res.ok) throw new Error();
      setStatus('تم التسجيل بنجاح! يمكنك تسجيل الدخول الآن.');
      setUsername(''); setPassword(''); setConfirm('');
    } catch {
      setStatus('تعذر التسجيل. اسم المستخدم مستخدم بالفعل أو هناك خطأ.');
    }
  };

  return (
    <Box sx={{ direction: 'rtl', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6fa' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: '#fff', p: 4, borderRadius: 2, boxShadow: 3, width: '100%', maxWidth: 400, mx: 2 }}>
        <Typography variant="h5" mb={2} fontWeight={700} align="center">تسجيل مستخدم جديد</Typography>
        <TextField
          label="اسم المستخدم"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="كلمة المرور"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="تأكيد كلمة المرور"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          select
          label="الدور"
          value={role}
          onChange={e => setRole(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="student">طالبة</MenuItem>
          <MenuItem value="teacher">معلمة</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, fontWeight: 700 }}>تسجيل</Button>
        {status && <Alert severity={status.includes('نجاح') ? 'success' : 'error'} sx={{ mt: 2 }}>{status}</Alert>}
      </Box>
    </Box>
  );
}
export default RegisterPage;
