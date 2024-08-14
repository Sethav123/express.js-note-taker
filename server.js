const express = require('express');
const app = express();
// const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001;

const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils.js');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page 
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
});
// POST Route to save a new note to /db/db.json
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Generate a unique id for the new note

  // Read existing notes, append the new note, and write back to the file
  readAndAppend(newNote, './db/db.json')
    .then(() => res.json(newNote))
});

// DELETE Route for a specific notes
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  readFromFile('./db/db.json')
    .then((data) => {
      const notes = JSON.parse(data);
      const result = notes.filter(note => note.id !== noteId);
      writeToFile('./db/db.json', result)
      res.json(`Note with ID ${noteId} has been deleted 🗑️`);
    })
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);