import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Typography, Paper, Snackbar } from '@mui/material';

function SupervisorSettingsPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (password && password !== confirm) {
      setStatus('كلمتا المرور غير متطابقتين');
      return;
    }
    // TODO: Send email/password update to backend
    setStatus('تم حفظ الإعدادات بنجاح!');
  };

  return (
    <Box sx={{ direction: 'rtl', bgcolor: '#f4f6fa', minHeight: '100vh', py: 4 }}>
      <Typography variant="h4" align="center" mb={3} fontWeight={700}>إعدادات المشرفة</Typography>
      <Paper sx={{ p: 4, maxWidth: 420, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSave}>
          <TextField
            label="البريد الإلكتروني"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="كلمة مرور جديدة"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="تأكيد كلمة المرور"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, fontWeight: 700 }}>حفظ الإعدادات</Button>
          {status && <Alert severity={status.includes('نجاح') ? 'success' : 'error'} sx={{ mt: 2 }}>{status}</Alert>}
        </Box>
      </Paper>
    </Box>
  );
}
export default SupervisorSettingsPage;
