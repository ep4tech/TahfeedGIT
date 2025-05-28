import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  // Dummy data
  const chartData = {
    labels: ['الطالبات', 'الإنجازات', 'نسبة المشاركة'],
    datasets: [
      {
        label: 'إحصائيات عامة',
        data: [30, 120, 85],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
      },
    ],
  };

  const tableData = [
    { group: 'المجموعة 1', students: 10, achievements: 40, participation: '90%' },
    { group: 'المجموعة 2', students: 8, achievements: 35, participation: '80%' },
    { group: 'المجموعة 3', students: 12, achievements: 45, participation: '95%' },
  ];

  return (
    <div style={{ padding: 24, direction: 'rtl' }}>
      <h2>لوحة التحكم</h2>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <Bar data={chartData} />
      </div>
      <h3 style={{ marginTop: 32 }}>إحصائيات المجموعات</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th>المجموعة</th>
            <th>عدد الطالبات</th>
            <th>عدد الإنجازات</th>
            <th>نسبة المشاركة</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(row => (
            <tr key={row.group}>
              <td>{row.group}</td>
              <td>{row.students}</td>
              <td>{row.achievements}</td>
              <td>{row.participation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Dashboard;
