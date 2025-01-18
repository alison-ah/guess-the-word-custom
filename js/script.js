const guessedLetters = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const playerGuess = document.querySelector(".letter");
const progress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const messages = document.querySelector(".message")
const playAgainButton = document.querySelector(".play-again");
const hintMessage = document.querySelector(".hint-message");
const hintButton = document.querySelector(".hint-button");

let guessedLettersList = [];
let remainingGuesses = 8;
let word, hint; 

const getSlang = async function () {
    const res = await fetch ("https://gist.githubusercontent.com/alison-ah/697e4e13a422d5fd9d5814f361659519/raw/f5ac311b01b77ab3a93d14c3dc64d760f2e085ca/genz_terms.json");
    const slang = await res.json();
    selectRandomSlang (slang);
};

const selectRandomSlang = function (slang) {
    const randomIndex = Math.floor(Math.random() * slang.length);
    const randomSlang = slang[randomIndex];
    word = randomSlang.term;
    hint = randomSlang.definition;
}


// Fire off the game
getSlang();

// Display symbols as placeholder for the word's letters
const placeholder = function (word) {
    const placeholderLetters = [];
    for (const letter of word) {
        placeholderLetters.push("●");
    }
    progress.innerText = placeholderLetters.join("");
};

guessButton.addEventListener("click", function (e) {
    e.preventDefault();
    // Empty the text of the message
    messages.innerText = "";
    // The guess
    const guess = playerGuess.value;
    // Validate guess
    const goodGuess = validateInput(guess);
    
    if (goodGuess) {
        makeGuess(guess);
    }
    playerGuess.value = "";
});

const validateInput = function (input) {
    const acceptedLetter = "";
    if (input.length === 0) {
        messages.innerText = `Please type a character.`;
    } else if (input.length > 1) {
        messages.innerText = `Please enter ONE character at a time.`;
    } else if (!input.match(acceptedLetter)) {
        messages.innerText = `Please enter a character.`;
    } else {
        return input;
    }
};

const makeGuess = function (guess) {
    guess = guess.toUpperCase();
    if (guessedLettersList.includes(guess)) {
        messages.innerText = `You've already guessed that letter. Please try again.`;
    } else {
        guessedLettersList.push(guess);
        updateGuessesRemaining(guess);
        updatePage();
        updateWord(guessedLettersList);
    }
};

const updatePage = function () {
    // Empty the text of the unordered list where the player's guessed letters will display.
    guessedLetters.innerHTML = "";
    // Add guess to list of guesses.
    for (const letter of guessedLettersList) {
        const li = document.createElement("li");
        li.innerText = letter;
        guessedLetters.append(li);
    }
};

const updateWord = function (guessedLettersList) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const revealWord = [];
    for (const letter of wordArray) {
      if (guessedLettersList.includes(letter)) {
        revealWord.push(letter.toUpperCase());
      } else {
        revealWord.push("●");
      }
    }
    progress.innerText = revealWord.join("");
    checkIfWin();
};

const updateGuessesRemaining = function (guess) {
    const upperWord = word.toUpperCase();
    if (!upperWord.includes(guess)) {
        messages.innerText = `The word or phrase does not include ${guess}. Please try again.`;
        remainingGuesses -= 1;
    } else {
        messages.innerText = `Good guess! Keep going!`;
    }

    if (remainingGuesses === 0) {
        messages.innerHTML = `Game over. The slang was "${word}." Better luck next time!<br><img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTdhZzZuZHpyeGNuZmltdDY1eTI2bHRrb2t0ZDFjNnlvZGF6eXpmZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ESzxkrVH853WoBiBgP/giphy.gif" alt="Noob"></span>.`;
        remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
        startOver();
    } else if (remainingGuesses === 1) {
        remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
    } else {
        remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    }
};

const checkIfWin = function () {
    if (word.toUpperCase() === progress.innerText) {
      messages.classList.add("win");
      messages.innerHTML = `<p>You guessed the correct slang! <i>Slay!</i><br><img src="https://media.giphy.com/media/GiIwrmtEV6gEgJVvHq/giphy.gif?cid=ecf05e47vg710g1rqs7nfdysm2e47s9d3rzs0z637j2wllo2&ep=v1_gifs_search&rid=giphy.gif&ct=g" alt="Girl gives heart symbol with hands">
</p>`;
      startOver();
    }
};

hintButton.addEventListener("click", function () {
    //get the definition as a hint
    hintMessage.innerHTML = `<strong>Hint:</strong> ${hint}`
    hintMessage.classList.remove("hide");
    hintButton.classList.add("hide");
});

const startOver = function() {
    guessButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    guessedLetters.classList.add("hide");
    playAgainButton.classList.remove("hide");
    hintButton.classList.add("hide");
};

playAgainButton.addEventListener("click", function () {
   //reset game
    messages.classList.remove("win");
    remainingGuesses = 8;
    guessedLettersList = [];
    guessButton.classList.add("guess");
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    guessedLetters.innerHTML = "";
    messages.innerText = "";
    getSlang();

    //reset UI
    guessButton.classList.remove("hide");
    remainingGuessesElement.classList.remove("hide");
    guessedLetters.classList.remove("hide");
    playAgainButton.classList.add("hide");
    hintButton.classList.remove("hide");
    hintMessage.innerHTML = "";
    progress.innerText = "";
});