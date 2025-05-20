// db.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

// Create sessions table
db.run(`
  CREATE TABLE IF NOT EXISTS sessions (
    sessionID TEXT PRIMARY KEY,
    phoneNumber TEXT,
    userInput TEXT
  )
`);

// Create results table
db.run(`
  CREATE TABLE IF NOT EXISTS results (
    studentID TEXT PRIMARY KEY,
    name TEXT,
    subject TEXT,
    grade TEXT
  )
`);

// Insert sample student data
db.run(`
  INSERT OR IGNORE INTO results (studentID, name, subject, grade) VALUES
  ('1001', 'Alice', 'Mathematics', 'A'),
  ('1002', 'Jean', 'English', 'B+'),
  ('1003', 'Claudine', 'Science', 'C')
`);

module.exports = db;
