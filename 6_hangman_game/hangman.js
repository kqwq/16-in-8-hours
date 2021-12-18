const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));
const fs  = require("file-system");
const words = fs.readFileSync("misspelled.txt").toString().split("\n");
const livesStart = 8;
async function game() {
  const word = words[Math.floor(Math.random() * words.length)].toUpperCase();
  let guesses = [];
  let wrongGuesses = [];
  let lives = livesStart;
  let wordDisplay = word.split('').map(() => '_');
  let gameOver = false;
  while (!gameOver) {
    console.log(wordDisplay.join(' '));
    console.log("Wrong letters: " + wrongGuesses.join(' '));
    let guess = await prompt(`You have ${lives} lives. Guess a letter: `);
    console.log('\033[2J');
    guess = guess.toUpperCase();
    if (guesses.includes(guess)) {
      console.log('You already guessed that letter!');
      continue
    } else if (word.includes(guess)) {
      wordDisplay = word.split('').map((letter, i) => {
        if (letter === guess) {
          return guess;
        }
        return wordDisplay[i];
      });
    } else if (guess.length !== 1) {
      continue
    } else {
      console.log('That letter is not in the word!');
      lives--;
      wrongGuesses.push(guess);
    }
    guesses.push(guess);
    if (lives === 0) {
      console.log('You lose! The word was ' + word);
      gameOver = true;
    } else if (!wordDisplay.includes('_')) {
      console.log('You win!');
      gameOver = true;
    }
  }
}
async function main() {
  let playAgain = true;
  console.log("Welcome to Mispelled Hangman! This is normal Hangman, but every word is misspelled!");
  while (playAgain) {
    await game();
    playAgain = await prompt('Play again? (y/n) ');
    playAgain = playAgain?.[0]?.toLowerCase() === 'y';
  }
  rl.close();
  console.log('Bye!');
}
main();