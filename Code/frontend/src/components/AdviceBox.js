import React, { useEffect, useState } from 'react';

function AdviceBox() {
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/common/advices/today')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setAdvice(data))
      .catch(() => setError('لا توجد نصيحة اليوم'));
  }, []);

  if (error) return <div>{error}</div>;
  if (!advice) return <div>جاري التحميل...</div>;
  return (
    <div className="advice-box">
      <strong>نصيحة اليوم:</strong>
      <div>{advice.text}</div>
    </div>
  );
}
export default AdviceBox;
