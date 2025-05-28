import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Typography, Paper, Grid, Snackbar } from '@mui/material';
import jsPDF from 'jspdf';

function SupervisorPage() {
  const [groupName, setGroupName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [tafseerPage, setTafseerPage] = useState('');
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState('');

  const handleAddGroup = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const res = await fetch('http://127.0.0.1:8000/groups/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName })
      });
      if (!res.ok) throw new Error();
      setStatus('تمت إضافة المجموعة!');
      setGroupName('');
    } catch {
      setStatus('تعذر إضافة المجموعة');
    }
  };
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const res = await fetch('http://127.0.0.1:8000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: studentName, password: '123456', role: 'student' })
      });
      if (!res.ok) throw new Error();
      setStatus('تمت إضافة الطالبة!');
      setStudentName('');
    } catch {
      setStatus('تعذر إضافة الطالبة');
    }
  };
  const handleAddTafseer = (e) => {
    e.preventDefault();
    setStatus('تمت إضافة صفحة التفسير!');
    setTafseerPage('');
  };
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const res = await fetch('http://127.0.0.1:8000/questions/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: question })
      });
      if (!res.ok) throw new Error();
      setStatus('تمت إضافة السؤال!');
      setQuestion('');
    } catch {
      setStatus('تعذر إضافة السؤال');
    }
  };
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  const handleReport = async () => {
    setReport(null);
    setReportError('');
    setReportLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/reports/monthly');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReport(data);
      setStatus('تم استخراج التقرير الشهري!');
    } catch {
      setReportError('تعذر استخراج التقرير');
    }
    setReportLoading(false);
  };

  const handleExportPDF = () => {
    if (!report) return;
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    doc.setFont('Helvetica');
    doc.text('ملخص التقرير الشهري', 220, 60, { align: 'center' });
    doc.text(`عدد الطالبات: ${report.students_count}`, 80, 120);
    doc.text(`مجموع الإنجازات: ${report.total_achievements}`, 80, 150);
    doc.text(`مجموع الأخطاء: ${report.total_mistakes}`, 80, 180);
    doc.save('monthly_report.pdf');
  };

  return (
    <Box sx={{ direction: 'rtl', bgcolor: '#f4f6fa', minHeight: '100vh', py: 4 }}>
      <Typography variant="h4" align="center" mb={3} fontWeight={700}>صفحة المشرفة</Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" mb={1}>إضافة مجموعة</Typography>
            <Box component="form" onSubmit={handleAddGroup} display="flex" gap={2} alignItems="center">
              <TextField label="اسم المجموعة" value={groupName} onChange={e => setGroupName(e.target.value)} required size="small" fullWidth />
              <Button type="submit" variant="contained">إضافة</Button>
            </Box>
          </Paper>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" mb={1}>إضافة طالبة</Typography>
            <Box component="form" onSubmit={handleAddStudent} display="flex" gap={2} alignItems="center">
              <TextField label="اسم الطالبة" value={studentName} onChange={e => setStudentName(e.target.value)} required size="small" fullWidth />
              <Button type="submit" variant="contained">إضافة</Button>
            </Box>
          </Paper>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" mb={1}>إضافة صفحة تفسير</Typography>
            <Box component="form" onSubmit={handleAddTafseer} display="flex" gap={2} alignItems="center">
              <TextField label="صفحة التفسير" value={tafseerPage} onChange={e => setTafseerPage(e.target.value)} required size="small" fullWidth />
              <Button type="submit" variant="contained">إضافة</Button>
            </Box>
          </Paper>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" mb={1}>إضافة سؤال</Typography>
            <Box component="form" onSubmit={handleAddQuestion} display="flex" gap={2} alignItems="center">
              <TextField label="السؤال" value={question} onChange={e => setQuestion(e.target.value)} required size="small" fullWidth />
              <Button type="submit" variant="contained">إضافة</Button>
            </Box>
          </Paper>
          <Paper sx={{ p: 3, mb: 2, textAlign: 'center' }}>
            <Button onClick={handleReport} variant="contained" color="secondary">استخراج التقرير الشهري</Button>
            {reportLoading && <Alert severity="info" sx={{ mt: 2 }}>جاري تحميل التقرير...</Alert>}
            {reportError && <Alert severity="error" sx={{ mt: 2 }}>{reportError}</Alert>}
            {report && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" mb={1}>ملخص التقرير الشهري</Typography>
                <Box sx={{ background: '#f7f7f7', p: 2, borderRadius: 2, maxWidth: 350, mx: 'auto' }}>
                  <Typography>عدد الطالبات: {report.students_count}</Typography>
                  <Typography>مجموع الإنجازات: {report.total_achievements}</Typography>
                  <Typography>مجموع الأخطاء: {report.total_mistakes}</Typography>
                </Box>
                <Button onClick={handleExportPDF} variant="outlined" color="primary" sx={{ mt: 2 }}>تصدير PDF</Button>
              </Box>
            )}
          </Paper>
          {status && <Snackbar open autoHideDuration={4000}><Alert severity="success" sx={{ width: '100%' }}>{status}</Alert></Snackbar>}
        </Grid>
      </Grid>
    </Box>
  );
}
export default SupervisorPage;
