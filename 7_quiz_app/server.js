import { readLines } from "https://deno.land/std@0.76.0/io/bufio.ts";

// Send data to clilent
function sendTo(recipient, data, raw) {
  console.log(`!send ${recipient} ${raw ? data : JSON.stringify(data)}`);
}

// Send command to server
function sendCommand(commandName, data) {
  console.log(`! ${commandName} ${data ? JSON.stringify(data) : ""}`);
}

// Persistent storage
const serverStorage = { // Limit 10 items, 100KB each
  getItem:    (key)        => console.log(`!get-item ${key}`),
  setItem:    (key, value) => console.log(`!set-item ${key} ${value}`),
  removeItem: (key)        => console.log(`!remove-item ${key}`),
  clear:      ()           => console.log(`!clear-items`)
};

// Variables
var isShowingResults = false;
let players = [];
let qIndex = 0;
var qCorrect;
let answers = [];
let questions = [];
let state = "ask"; // ask | result | write-in
function getDefaultQuestions() {
  return [
    {
      question: "How long is a fortnite?",
      choices: [
        "2 Days", 
        "7 Days",
        "14 Days",
        "49 Days", 
      ],
      correct: 2,
      author: "Squishy",
      date: new Date()
    },
    {
      question: "Who was the first U.S. President?",
      choices: [
        "Ben Franklin",
        "George Washington",
        "John Adams",
        "George W. Bush"
      ],
      correct: 1,
      author: "Squishy",
      date: new Date()
    }
  ];
}

// Main loop
function mainLoop() {
  let nextSeconds = 10;
  console.log("state", state)
  switch (state) {
    
    case "ask": 
      let q = JSON.parse(JSON.stringify(questions[qIndex]))
      q.qIndex = qIndex;
      q.nextSeconds = nextSeconds = 10;
      qCorrect = q.correct;
      q.state = "ask";
      delete q.correct;
      sendTo("everyone", q); // Send question data to client.html
      state = "result";
      break;
      
    case "result": 
      // Broadcast all answers
      nextSeconds = 3;
      sendTo("everyone", {
        state: "result",
        qIndex: qIndex,
        correct: qCorrect,
        answers: answers,
        nextSeconds: nextSeconds
      });
      answers = []
      
      // Prepare for next step
      qIndex ++; // Advance to next question
      if (qIndex >= questions.length) {
        qIndex = 0;
        state = "write-in";
      } else {
        state = "ask";
      }
      break;
      
    case "write-in":
      nextSeconds = 40;
      sendTo("everyone", {
        state: "write-in",
        nextSeconds: nextSeconds
      });
      
      state = "ask";
      break;
      
  }

  
  

  mainTimeout = setTimeout(mainLoop, nextSeconds * 1000);
}
serverStorage.getItem("questions");
var mainTimeout = setTimeout(mainLoop, 1000 * 1);

// Get data from server and connected clients
function onInput(sender, message) {
  let { command, response } = JSON.parse(message);
  if (sender === "server") { // Handle server commands
    switch (command) {
      case "player-join":
        players.push(response);
        break;

      case "player-leave":
        players.splice(players.indexOf(response), 1);
        break;

      case "get-item":
        if (!response.ok) {
          questions = getDefaultQuestions();
        } else if (response.key === "questions") {
          questions = JSON.parse(response.value);
        }
        console.log(`Loaded ${questions.length} questions`);
        break;

      default:
        console.log(`Unrecognized server command ${command}`);
    }
  } else { // Handle player messages
    switch (command) {
      case "answer":
        let answerInd = answers.findIndex(a => a.from == sender)
        if (answerInd !== -1) {
          answers[answerInd].choice = response;
          return
        }
        answers.push({
          from: sender,
          choice: response // 0 to 3
        });
        sendTo("everyone", {
          state: "update",
          answerCount: answers.length,
          playerCount: players.length
        });
        if (answers.length >= players.length) {
          clearTimeout(mainTimeout);
          mainTimeout = setTimeout(mainLoop, 500);
        }
        break;
        
      case "add-question":
        let nonBlankChoices = response.choices.filter(c => c.length);
        let nQ = { // new question
          question: response.question.slice(0, 140),
          choices: nonBlankChoices.concat("[empty]", "[empty]", "[empty]", "[empty]").slice(0, 4),
          correct: response.correct,
          author: sender,
          date: new Date()
        }
        if (nQ.question.length < 10 || nonBlankChoices.length === 0) {
          break;
        }
        questions.push(nQ);
        serverStorage.setItem("questions", JSON.stringify(questions));
        break;
        
      case "delete-all":
        sendTo(sender, {
          state: "update",
          count: questions.filter(q => q.author == sender).length
        })
        questions = questions.filter(q => q.author != sender);
        serverStorage.setItem("questions", JSON.stringify(questions));
        break;
      
    }
  }
}

console.log("Running");
for await (let msg of readLines(Deno.stdin)) onInput(...msg.split(/ (.+)/s));