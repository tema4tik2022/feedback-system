import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [teacher, setTeacher] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [result, setResult] = useState(null);
  const [average, setAverage] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateAverageRating = (teacherName, newRating) => {
    const raw = localStorage.getItem('teacherRatings') || '{}';
    const ratings = JSON.parse(raw);

    if (!ratings[teacherName]) {
      ratings[teacherName] = [];
    }

    ratings[teacherName].push(Number(newRating));
    localStorage.setItem('teacherRatings', JSON.stringify(ratings));

    const avg =
      ratings[teacherName].reduce((sum, r) => sum + r, 0) /
      ratings[teacherName].length;

    setAverage(avg.toFixed(2));
  };

  const handleSubmit = () => {
    if (!teacher || !rating) {
      alert('Введіть ім’я викладача та оберіть оцінку.');
      return;
    }

    setResult({ teacher, rating, comment });
    updateAverageRating(teacher, rating);
  };

  return (
    <div className={`App ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему'}
      </button>

      <h1>Система оцінки задоволеності</h1>

      <input
        type="text"
        placeholder="Ім’я викладача"
        value={teacher}
        onChange={(e) => setTeacher(e.target.value)}
      />

      <label>Оцініть урок:</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value="">-- Виберіть оцінку --</option>
        <option value="1">1 - Дуже погано</option>
        <option value="2">2 - Погано</option>
        <option value="3">3 - Задовільно</option>
        <option value="4">4 - Добре</option>
        <option value="5">5 - Відмінно</option>
      </select>

      <textarea
        placeholder="Залиште коментар"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <button onClick={handleSubmit}>Надіслати</button>

      {result && (
        <div className="result">
          <h3>Результат:</h3>
          <p><strong>Викладач:</strong> {result.teacher}</p>
          <p><strong>Оцінка:</strong> {result.rating}</p>
          <p><strong>Коментар:</strong> {result.comment}</p>
          {average && (
            <p><strong>Середній рейтинг викладача:</strong> {average}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
