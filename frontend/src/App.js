import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);  // Для хранения общего количества страниц
  const [totalStudents, setTotalStudents] = useState(0);  // Для хранения общего количества студентов

  useEffect(() => {
    // Запрос для получения студентов с пагинацией
    fetch(`http://localhost:3000/students/?skip=${(page - 1) * pageSize}&limit=${pageSize}`)
      .then(response => response.json())
      .then(data => setStudents(data));

    // Запрос для получения общего числа студентов
    fetch(`http://localhost:3000/students/count`)
      .then(response => response.json())
      .then(data => {
        setTotalStudents(data.count);  // Обновляем количество студентов
        setTotalPages(Math.ceil(data.count / pageSize));  // Рассчитываем общее количество страниц
      });
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);  // Изменение страницы
  };

  return (
    <div className="App">
      <h1>Таблица студентов</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Отчество</th>
            <th>Курс</th>
            <th>Группа</th>
            <th>Факультет</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.last_name}</td>
              <td>{student.first_name}</td>
              <td>{student.middle_name}</td>
              <td>{student.course}</td>
              <td>{student.group}</td>
              <td>{student.faculty}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => handlePageChange(Math.max(page - 1, 1))}>Предыдущий</button>
        <span>Страница: {page}</span> {/* Отображение текущей страницы */}
        <button onClick={() => handlePageChange(Math.min(page + 1, totalPages))}>Следующий</button>
        
        {/* Кнопки для перехода к конкретным страницам */}
        <div>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={page === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <label>
          Размер списка:
          <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default App;
