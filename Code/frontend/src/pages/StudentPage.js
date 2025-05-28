import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Alert, Typography, Paper, Snackbar, Table, TableHead, TableBody, TableRow, TableCell, Grid } from '@mui/material';

const surahs = [
  'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة',
  'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه',
  'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم',
  'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر', 'فصلت', 'الشورى',
  'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم',
  'القمر', 'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون',
  'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح', 'الجن', 'المزمل', 'المدثر',
  'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس', 'التكوير', 'الانفطار', 'المطففين', 'الانشقاق',
  'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين',
  'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات', 'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل',
  'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص', 'الفلق', 'الناس'
];

function StudentPage() {
  const [fromSurah, setFromSurah] = useState('الفاتحة');
  const [fromAyah, setFromAyah] = useState(1);
  const [toSurah, setToSurah] = useState('الفاتحة');
  const [toAyah, setToAyah] = useState(1);
  const [status, setStatus] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [achievementsError, setAchievementsError] = useState('');

  useEffect(() => {
    const user_id = 1; // TODO: Use real user id from cookie
    const today = new Date().toISOString().slice(0, 10);
    fetch(`http://127.0.0.1:8000/achievements/user/${user_id}?date=${today}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setAchievements(data);
        setAchievementsLoading(false);
      })
      .catch(() => {
        setAchievementsError('تعذر جلب الإنجازات');
        setAchievementsLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    // TODO: Replace user_id with real value from cookie
    const user_id = 1;
    const today = new Date().toISOString().slice(0, 10);
    const payload = {
      user_id,
      date: today,
      surah_from: fromSurah,
      ayah_from: Number(fromAyah),
      surah_to: toSurah,
      ayah_to: Number(toAyah)
    };
    try {
      const res = await fetch('http://127.0.0.1:8000/achievements/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      setStatus('تم تسجيل الإنجاز بنجاح!');
    } catch {
      setStatus('حدث خطأ أثناء التسجيل.');
    }
  };

  return (
    <Box sx={{ direction: 'rtl', bgcolor: '#f4f6fa', minHeight: '100vh', py: 4 }}>
      <Typography variant="h4" align="center" mb={3} fontWeight={700}>صفحة الطالب</Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={2}>إضافة إنجاز جديد</Typography>
            <Box component="form" onSubmit={handleSubmit} display="flex" flexWrap="wrap" gap={2} alignItems="center">
              <TextField label="من السورة" value={fromSurah} onChange={e => setFromSurah(e.target.value)} required size="small" sx={{ flex: 1 }} />
              <TextField label="من الآية" type="number" value={fromAyah} onChange={e => setFromAyah(e.target.value)} required size="small" sx={{ flex: 1 }} />
              <TextField label="إلى السورة" value={toSurah} onChange={e => setToSurah(e.target.value)} required size="small" sx={{ flex: 1 }} />
              <TextField label="إلى الآية" type="number" value={toAyah} onChange={e => setToAyah(e.target.value)} required size="small" sx={{ flex: 1 }} />
              <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>إضافة إنجاز</Button>
            </Box>
            {status && <Snackbar open autoHideDuration={4000}><Alert severity="success" sx={{ width: '100%' }}>{status}</Alert></Snackbar>}
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>إنجازات اليوم</Typography>
            {achievementsLoading && <Alert severity="info">جاري التحميل...</Alert>}
            {achievementsError && <Alert severity="error">{achievementsError}</Alert>}
            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>الاسم</TableCell>
                  <TableCell>من</TableCell>
                  <TableCell>من آية</TableCell>
                  <TableCell>إلى</TableCell>
                  <TableCell>إلى آية</TableCell>
                  <TableCell>الوقت</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {achievements.map((a, i) => (
                  <TableRow key={i}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.from}</TableCell>
                    <TableCell>{a.fromAyah}</TableCell>
                    <TableCell>{a.to}</TableCell>
                    <TableCell>{a.toAyah}</TableCell>
                    <TableCell>{a.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
export default StudentPage;
