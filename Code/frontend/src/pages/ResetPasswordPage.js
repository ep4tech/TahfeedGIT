import React, { useState } from 'react';

function ResetPasswordPage() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    if (newPassword !== confirm) {
      setStatus('كلمتا المرور غير متطابقتين');
      return;
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/users/reset_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, new_password: newPassword })
      });
      if (!res.ok) throw new Error();
      setStatus('تم تغيير كلمة المرور بنجاح!');
      setUsername(''); setNewPassword(''); setConfirm('');
    } catch {
      setStatus('تعذر تغيير كلمة المرور. تحقق من اسم المستخدم.');
    }
  };

  return (
    <Box sx={{ direction: 'rtl', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6fa' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: '#fff', p: 4, borderRadius: 2, boxShadow: 3, width: '100%', maxWidth: 400, mx: 2 }}>
        <Typography variant="h5" mb={2} fontWeight={700} align="center">إعادة تعيين كلمة المرور</Typography>
        <TextField
          label="اسم المستخدم"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="كلمة المرور الجديدة"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, fontWeight: 700 }}>تغيير كلمة المرور</Button>
        {status && <Alert severity={status.includes('نجاح') ? 'success' : 'error'} sx={{ mt: 2 }}>{status}</Alert>}
      </Box>
    </Box>
  );
}
export default ResetPasswordPage;
