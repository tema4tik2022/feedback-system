import React, { useState, useEffect } from 'react';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [toast, setToast] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [allRatings, setAllRatings] = useState([]);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const data = localStorage.getItem('allRatings');
    if (data) {
      setAllRatings(JSON.parse(data));
    }
  }, []);

  const submit = () => {
    if (!name || !teacher || rating === 0) {
      alert("Заповніть усі поля");
      return;
    }

    const newEntry = { name, teacher, rating, comment, date: new Date().toLocaleString() };
    const updated = [...allRatings, newEntry];
    setAllRatings(updated);
    localStorage.setItem('allRatings', JSON.stringify(updated));
    setName(''); setTeacher(''); setComment(''); setRating(0);
    setToast('Оцінка надіслана успішно!');
    setTimeout(() => setToast(''), 3000);
  };

  const exportCSV = () => {
    const header = "Ім'я,Викладач,Оцінка,Коментар,Дата\n";
    const rows = allRatings.map(r => `${r.name},${r.teacher},${r.rating},"${r.comment}",${r.date}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ratings.csv";
    a.click();
  };

  const teacherRatings = allRatings.reduce((acc, r) => {
    acc[r.teacher] = acc[r.teacher] || [];
    acc[r.teacher].push(r);
    return acc;
  }, {});

  return (
    <div className="container">
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Змінити тему
      </button>
      <h1>Система оцінки уроків</h1>

      <input placeholder="Ваше ім’я" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Ім’я викладача" value={teacher} onChange={e => setTeacher(e.target.value)} />

      <label>Оцінка:</label>
      <div>
        {[1,2,3,4,5].map(n => (
          <span key={n} className={n <= rating ? "star filled" : "star"} onClick={() => setRating(n)}>★</span>
        ))}
      </div>

      <textarea placeholder="Коментар" value={comment} onChange={e => setComment(e.target.value)} />
      <button onClick={submit}>Надіслати оцінку</button>
      <button onClick={exportCSV}>Експортувати в CSV</button>

      {toast && <div className="toast">{toast}</div>}

      <h2>Середній рейтинг викладачів</h2>
      <table>
        <thead>
          <tr><th>Викладач</th><th>Середній бал</th></tr>
        </thead>
        <tbody>
          {Object.entries(teacherRatings).map(([t, arr]) => (
            <tr key={t} onClick={() => setSelectedTeacher(t)}>
              <td>{t}</td>
              <td>{(arr.reduce((a, b) => a + b.rating, 0) / arr.length).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTeacher && (
        <>
          <h3>Оцінки викладача: {selectedTeacher}</h3>
          <table>
            <thead>
              <tr><th>Ім’я</th><th>Оцінка</th><th>Коментар</th><th>Дата</th></tr>
            </thead>
            <tbody>
              {teacherRatings[selectedTeacher].map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.rating}</td>
                  <td>{r.comment}</td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
