const API_URL = 'http://localhost:3000/api/records';

// Функція для завантаження даних з сервера
async function loadDataFromServer() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Помилка при завантаженні даних');
        }
        const records = await response.json();
        return records;
    } catch (error) {
        console.error('Помилка:', error);
        return [];
    }
}

// Функція для відображення даних у таблиці
async function renderTable() {
    const records = await loadDataFromServer();
    const tableBody = document.querySelector('#gradesTable tbody');
    tableBody.innerHTML = '';

    records.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.fullName}</td>
            <td>${record.subject}</td>
            <td>${record.grade}</td>
            <td>${record.date}</td>
            <td>
                <button onclick="deleteRecord(${index})">Видалити</button>
            </td>`;
        tableBody.appendChild(row);
    });
}

// Функція для видалення запису
async function deleteRecord(index) {
    try {
        const response = await fetch(`${API_URL}/${index}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Помилка при видаленні запису');
        }
        renderTable(); // Оновити таблицю після видалення
    } catch (error) {
        console.error('Помилка:', error);
    }
}

// Функція для експорту даних у JSON
async function exportToJSON() {
    try {
        const records = await loadDataFromServer();
        const jsonString = JSON.stringify(records, null, 4);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'studentRecords.json';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Помилка при експорті у JSON:', error);
    }
}

// Функція для експорту даних у XML
async function exportToXML() {
    try {
        const response = await fetch(`${API_URL}/export/xml`);
        if (!response.ok) {
            throw new Error('Помилка при завантаженні XML');
        }
        const xmlString = await response.text();
        const blob = new Blob([xmlString], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'studentRecords.xml';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Помилка при експорті у XML:', error);
    }
}

// Обробка події відправки форми
document.getElementById('studentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        studentId: document.getElementById('studentId').value,
        faculty: document.getElementById('faculty').value,
        specialty: document.getElementById('specialty').value,
        course: document.getElementById('course').value,
        group: document.getElementById('group').value,
        subject: document.getElementById('subject').value,
        grade: document.getElementById('grade').value,
        date: document.getElementById('date').value,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error('Помилка при збереженні даних');
        }
        renderTable(); // Оновити таблицю після додавання нового запису
        this.reset(); // Очистити форму
    } catch (error) {
        console.error('Помилка:', error);
    }
});

// Додавання обробників подій для кнопок експорту
document.getElementById('exportJsonButton').addEventListener('click', exportToJSON);
document.getElementById('exportXmlButton').addEventListener('click', exportToXML);

// Завантажити дані при завантаженні сторінки
window.onload = renderTable;