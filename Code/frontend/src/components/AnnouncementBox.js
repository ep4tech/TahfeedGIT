import React, { useEffect, useState } from 'react';

function AnnouncementBox() {
  const [announcements, setAnnouncements] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/common/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data || []));
  }, []);

  useEffect(() => {
    if (announcements.length > 1) {
      const timer = setInterval(() => {
        setCurrent(c => (c + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [announcements]);

  if (!announcements.length) return <div>لا توجد إعلانات حالياً</div>;
  return (
    <div className="announcement-box">
      <strong>إعلان:</strong>
      <div>{announcements[current].text}</div>
    </div>
  );
}
export default AnnouncementBox;
