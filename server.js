const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const readData = () => {
  return JSON.parse(fs.readFileSync('db.json'));
};

const writeData = (data) => {
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
};

// READ ALL STUDENTS
app.get('/students', (req, res) => {
  res.json(readData());
});

// READ STUDENT BY ID
app.get('/students/:id', (req, res) => {
  const data = readData();
  const student = data.find(s => s.id == req.params.id);

  student
    ? res.json(student)
    : res.status(404).json({ message: 'Student not found' });
});

// CREATE STUDENT
app.post('/students', (req, res) => {
  const data = readData();

  const newStudent = {
    id: Date.now(),
    name: req.body.name,
    dept: req.body.dept,
    age: req.body.age
  };

  data.push(newStudent);
  writeData(data);

  res.status(201).json(newStudent);
});

// UPDATE STUDENT
app.put('/students/:id', (req, res) => {
  const data = readData();
  const index = data.findIndex(s => s.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  data[index].dept = req.body.dept;
  data[index].age = req.body.age;

  writeData(data);
  res.json(data[index]);
});

// DELETE STUDENT
app.delete('/students/:id', (req, res) => {
  let data = readData();
  data = data.filter(s => s.id != req.params.id);

  writeData(data);
  res.json({ message: 'Student deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});