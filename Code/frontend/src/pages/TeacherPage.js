import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Typography, Paper, Snackbar, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

const groups = ['المجموعة 1', 'المجموعة 2', 'المجموعة 3'];
const students = {
  'المجموعة 1': ['أسماء محمد', 'سارة علي'],
  'المجموعة 2': ['هبة خالد', 'منى يوسف'],
  'المجموعة 3': ['دلال أحمد', 'رنا سالم']
};

function TeacherPage() {
  const [group, setGroup] = useState(groups[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [results, setResults] = useState(() => students[groups[0]].map(name => ({ name, recitationMistakes: 0, divisionMistakes: 0, memorizationMistakes: 0 })));
  const [status, setStatus] = useState('');

  const handleGroupChange = (g) => {
    setGroup(g);
    setResults(students[g].map(name => ({ name, recitationMistakes: 0, divisionMistakes: 0, memorizationMistakes: 0 })));
  };

  const handleChange = (i, field, value) => {
    setResults(res => res.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    // TODO: Replace user_id with real value from cookie or context
    const user_id = 1;
    const promises = results.flatMap(r => [
      fetch('http://127.0.0.1:8000/mistakes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, date, mistake_type: 'recitation', count: Number(r.recitationMistakes) })
      }),
      fetch('http://127.0.0.1:8000/mistakes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, date, mistake_type: 'division', count: Number(r.divisionMistakes) })
      }),
      fetch('http://127.0.0.1:8000/mistakes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, date, mistake_type: 'memorization', count: Number(r.memorizationMistakes) })
      })
    ]);
    try {
      await Promise.all(promises);
      setStatus('تم حفظ النتائج!');
    } catch {
      setStatus('حدث خطأ أثناء الحفظ.');
    }
  };

  return (
    <div style={{ padding: 24, direction: 'rtl' }}>
      <h2>إدخال نتائج السرد والتحزيب</h2>
      <form onSubmit={handleSubmit}>
        <label>المجموعة:</label>
        <select value={group} onChange={e => handleGroupChange(e.target.value)}>{groups.map(g => <option key={g}>{g}</option>)}</select>
        <label>التاريخ:</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th>الطالبة</th>
              <th>أخطاء السرد</th>
              <th>أخطاء التحزيب</th>
              <th>أخطاء الحفظ</th>
            </tr>
          </thead>
  );
}
export default TeacherPage;
