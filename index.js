import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import fs from "fs";

const app = express();
const port = 3000;

app.set("view engine", "ejs");

let quizContent = fs.readFileSync("capitals.json", "utf-8");
let quiz = JSON.parse(quizContent);

console.log(quiz);

let totalCorrect = 0;
let currentQuestion = {};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const countryKeys = Object.keys(quiz);
  const randomCountryKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
  currentQuestion = quiz[randomCountryKey];
  console.log(currentQuestion);
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
