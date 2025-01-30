const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Reading data
app.get('/students', (req, res) => {
  fs.readFile('students.json', (err, data) => {
    if (err) return res.status(500).send('Error reading data');
    res.json(JSON.parse(data));
  });
});

// Adding  tudent
app.post('/students', (req, res) => {
  const newStudent = req.body;
  fs.readFile('students.json', (err, data) => {
    if (err) return res.status(500).send('Error reading data');
    const students = JSON.parse(data);
    students.push(newStudent);
    fs.writeFile('students.json', JSON.stringify(students, null, 2), (err) => {
      if (err) return res.status(500).send('Error saving data');
      res.status(201).json({ message: 'Student added successfully' });
    });
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

// Search students by field and value
app.get('/students/search', (req, res) => {
  const { field, value } = req.query;

  if (!field || !value) {
    return res.status(400).json({ message: 'Field and value are required' });
  }

  fs.readFile('students.json', (err, data) => {
    if (err) return res.status(500).send('Error reading data');
    const students = JSON.parse(data);

    const results = students.filter((student) =>
      student[field]?.toLowerCase() === value.toLowerCase()
    );

    res.json(results);
  });
});

app.delete('/students/delete/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  console.log('Delete Request:', studentId);

  const studentIndex = students.findIndex((s) => s.studentId === studentId);
  if (studentIndex === -1) {
    return res.status(404).send({ error: 'Student not found' });
  }

  // Remove the student record
  students.splice(studentIndex, 1);

  // Save changes to the JSON file
  fs.writeFileSync('students.json', JSON.stringify(students, null, 2));

  res.send({ message: 'Student record deleted successfully' });
});


/*update */
const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3000;


app.use(express.json());

// Load student records from JSON file
const readStudentsData = () => {
  try {
    const data = fs.readFileSync('students.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading students.json:', error);
    return [];
  }
};

// Save updated student records to JSON file
const writeStudentsData = (data) => {
  try {
    fs.writeFileSync('students.json', JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing students.json:', error);
    return false;
  }
};

// PUT (Update) API Endpoint
app.put('/students/update/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const updatedData = req.body;

  let students = readStudentsData();

  // Find student by ID
  const studentIndex = students.findIndex((student) => student.id === studentId);
  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Update only the provided fields
  students[studentIndex] = { ...students[studentIndex], ...updatedData };

  // Save updated data
  if (writeStudentsData(students)) {
    return res.json({ message: 'Student record updated successfully', student: students[studentIndex] });
  } else {
    return res.status(500).json({ error: 'Failed to update student record' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



// Delete student by ID
app.delete('/api/students/:id', (req, res) => {
  const studentId = req.params.id;
  let students = JSON.parse(fs.readFileSync('students.json', 'utf-8'));

  // Find the index of the student to delete
  const studentIndex = students.findIndex(student => student.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  // Remove the student from the array
  students.splice(studentIndex, 1);

  // Write the updated array back to the file
  fs.writeFileSync('students.json', JSON.stringify(students, null, 2));

  res.status(200).json({ message: 'Student deleted successfully' });
});


// Update student by ID
app.put('/api/students/:id', (req, res) => {
  const studentId = req.params.id;
  let students = JSON.parse(fs.readFileSync('students.json', 'utf-8'));
  
  // Find the student by ID
  const studentIndex = students.findIndex(student => student.id === studentId);
  
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  // Update the student's data
  students[studentIndex] = {
    ...students[studentIndex],
    ...req.body
  };

  // Write the updated data back to the file
  fs.writeFileSync('students.json', JSON.stringify(students, null, 2));

  res.status(200).json({ message: 'Student updated successfully' });
});
