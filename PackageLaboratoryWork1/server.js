const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE_JSON = path.join(__dirname, 'data.json'); // Шлях до data.json
const DATA_FILE_XML = path.join(__dirname, 'data.xml');   // Шлях до data.xml

// Middleware для обробки JSON та URL-encoded даних
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Вказуємо Express, де знаходяться статичні файли (HTML, CSS, JS)
app.use(express.static(__dirname)); // Використовуємо поточну папку (PackageLaboratoryWork1)

// Завантаження даних з файлу JSON
function loadDataFromJSON() {
    if (!fs.existsSync(DATA_FILE_JSON)) {
        fs.writeFileSync(DATA_FILE_JSON, '[]');
    }
    const data = fs.readFileSync(DATA_FILE_JSON, 'utf8');
    return JSON.parse(data);
}

// Збереження даних у файл JSON
function saveDataToJSON(data) {
    fs.writeFileSync(DATA_FILE_JSON, JSON.stringify(data, null, 4));
}

// Збереження даних у файл XML
function saveDataToXML(data) {
    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<students>\n';
    data.forEach(record => {
        xmlString += '  <student>\n';
        xmlString += `    <fullName>${record.fullName}</fullName>\n`;
        xmlString += `    <studentId>${record.studentId}</studentId>\n`;
        xmlString += `    <faculty>${record.faculty}</faculty>\n`;
        xmlString += `    <specialty>${record.specialty}</specialty>\n`;
        xmlString += `    <course>${record.course}</course>\n`;
        xmlString += `    <group>${record.group}</group>\n`;
        xmlString += `    <subject>${record.subject}</subject>\n`;
        xmlString += `    <grade>${record.grade}</grade>\n`;
        xmlString += `    <date>${record.date}</date>\n`;
        xmlString += '  </student>\n';
    });
    xmlString += '</students>';
    fs.writeFileSync(DATA_FILE_XML, xmlString);
}

// API для отримання всіх записів
app.get('/api/records', (req, res) => {
    const records = loadDataFromJSON();
    res.json(records);
});

// API для додавання нового запису
app.post('/api/records', (req, res) => {
    const records = loadDataFromJSON();
    const newRecord = req.body;

    // Перевірка наявності обов'язкових полів
    if (!newRecord.fullName || !newRecord.studentId || !newRecord.subject || !newRecord.grade || !newRecord.date) {
        return res.status(400).json({ error: 'Відсутні обов\'язкові поля' });
    }

    records.push(newRecord);
    saveDataToJSON(records);
    saveDataToXML(records); // Оновлення XML файлу
    res.status(201).json(newRecord);
});

// API для оновлення запису
app.put('/api/records/:id', (req, res) => {
    const records = loadDataFromJSON();
    const id = parseInt(req.params.id); // Отримуємо id запису
    const updatedRecord = req.body; // Отримуємо оновлені дані з тіла запиту

    // Перевіряємо, чи існує запис з таким id
    if (id < 0 || id >= records.length) {
        return res.status(404).json({ error: 'Запис не знайдено' });
    }

    // Оновлюємо запис
    records[id] = { ...records[id], ...updatedRecord };

    // Зберігаємо оновлені дані у файли
    saveDataToJSON(records);
    saveDataToXML(records);

    // Повертаємо оновлений запис
    res.status(200).json(records[id]);
});

// API для видалення запису
app.delete('/api/records/:id', (req, res) => {
    const records = loadDataFromJSON();
    const id = parseInt(req.params.id);

    // Перевіряємо, чи існує запис з таким id
    if (id < 0 || id >= records.length) {
        return res.status(404).json({ error: 'Запис не знайдено' });
    }

    // Видаляємо запис
    const deletedRecord = records.splice(id, 1)[0];
    saveDataToJSON(records);
    saveDataToXML(records); // Оновлення XML файлу
    res.status(200).json(deletedRecord);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});