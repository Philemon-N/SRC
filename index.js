// server.js
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/ussd", (req, res) => {
  const { sessionId, phoneNumber, text } = req.body;
  const inputs = text.split("*");
  let response = "";

  // Save session input
  db.run(
    `INSERT INTO sessions (sessionID, phoneNumber, userInput) VALUES (?, ?, ?)`,
    [sessionId, phoneNumber, text],
    (err) => {
      if (err) console.error("Session error:", err.message);
    }
  );

  if (text === "") {
    response = `CON Welcome / Murakaza neza\n1. English\n2. Ikinyarwanda`;
  } else if (inputs.length === 1) {
    if (inputs[0] === "1") {
      response = `CON Main Menu:\n1. Check Exam Result\n2. Contact School\n0. Back`;
    } else if (inputs[0] === "2") {
      response = `CON Menyu nyamukuru:\n1. Reba amanota\n2. Vugana n'ishuri\n0. Subira inyuma`;
    } else {
      response = `END Invalid option`;
    }
  } else if (inputs.length === 2) {
    if (inputs[0] === "1" && inputs[1] === "1") {
      response = `CON Enter your student ID:`;
    } else if (inputs[0] === "2" && inputs[1] === "1") {
      response = `CON Andika nimero yawe y'umunyeshuri:`;
    } else if (inputs[1] === "2") {
      response =
        inputs[0] === "1"
          ? `END Call us on 0780000000 or visit school.edu`
          : `END Hamagara kuri 0780000000 cyangwa suura school.edu`;
    } else {
      response = `END Invalid option.`;
    }
  } else if (inputs.length === 3) {
    const studentID = inputs[2];
    db.get(
      `SELECT * FROM results WHERE studentID = ?`,
      [studentID],
      (err, row) => {
        if (err) {
          response = `END System error.`;
        } else if (row) {
          const lang = inputs[0];
          response =
            lang === "1"
              ? `END Result for ${row.name}\nSubject: ${row.subject}\nGrade: ${row.grade}`
              : `END Amanota ya ${row.name}\nIsomo: ${row.subject}\nAmanota: ${row.grade}`;
        } else {
          response =
            inputs[0] === "1"
              ? `END Student ID not found.`
              : `END Nimero y'umunyeshuri ntiyabonetse.`;
        }
        res.set("Content-Type", "text/plain");
        res.send(response);
      }
    );
    return;
  } else {
    response = `END Invalid flow.`;
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

app.listen(3000, () => {
  console.log("USSD Result Checker running on port 3000");
});
