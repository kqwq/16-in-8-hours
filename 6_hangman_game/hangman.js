const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));
const words = require('./words.json').data;

class Hangman {
  constructor(word, guesses) {
    this.word = word;
    this.guesses = guesses;
    this.guessedLetters = [];
    this.correctGuesses = [];
  }

  guessLetter(letter) {
    this.guessedLetters.push(letter);
    if (this.word.includes(letter)) {
      this.correctGuesses.push(letter);
    }
  }

  isOver() {
    return this.guesses === 0 || this.word.split('').every((letter) => this.correctGuesses.includes(letter));
  }

  isWon() {
    return this.word.split('').every((letter) => this.correctGuesses.includes(letter));
  }

  getStatus() {
    let status = '';
    this.word.split('').forEach((letter) => {
      if (this.correctGuesses.includes(letter)) {
        status += letter;
      } else {
        status += '_';
      }
    });
    return status;
  }
}

async function main() {
  const word = words[Math.floor(Math.random() * words.length)];
  const guesses = await prompt('Enter guesses: ');
  const game = new Hangman(word, guesses);
  while (!game.isOver()) {
    console.log(game.getStatus());
    const letter = await prompt(`Enter a letter: `);
    game.guessLetter(letter);
  }
  if (game.isWon()) {
    console.log('You won!');
  } else {
    console.log('You lost!');
  }
  rl.close();
}
main()