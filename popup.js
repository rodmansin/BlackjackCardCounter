//Screens and info
const deckInputScreen = document.getElementById("deckInputScreen");
const counterScreen = document.getElementById("counterScreen");
const runningCountSpan = document.getElementById("runningCount");
const trueCountSpan = document.getElementById("trueCount");
const cardsSeenSpan = document.getElementById("cardsSeen");
const betSuggestionSpan = document.getElementById("betSuggestion");

//User input
const deckInput = document.getElementById("deckInput");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const undoBtn = document.getElementById("undoBtn");
const incrementBtn = document.getElementById("incrementBtn");
const decrementBtn = document.getElementById("decrementBtn");
const zeroBtn = document.getElementById("zeroBtn");

// Game variables
let runningCount = 0;
let decks = null;
let cardsSeen = 0;
let history = [];   //For undo button (not saved in session)

//Restore previous session data (if it exists)
if (localStorage.getItem("runningCount") !== null && localStorage.getItem("decks") !== null) {
    runningCount = parseInt(localStorage.getItem("runningCount"));
    decks = parseInt(localStorage.getItem("decks"));
    cardsSeen = parseInt(localStorage.getItem("cardsSeen"));
    showCounterScreen();
    updateDisplay();
}


//BUTTON FUNCTIONS
startBtn.onclick = () => {
    const input = parseInt(deckInput.value);
    if (input && input > 0) {
        decks = input;
        runningCount = 0;
        cardsSeen = 0;
        history = [];
        localStorage.setItem("decks", decks);
        localStorage.setItem("runningCount", runningCount);
        localStorage.setItem("cardsSeen", cardsSeen);
        showCounterScreen();
        updateDisplay();
    }
};

resetBtn.onclick = () => {
    localStorage.clear();
    runningCount = 0;
    decks = null;
    cardsSeen = 0;
    history = [];

    showDeckInputScreen();
};

undoBtn.onclick = () => {
    if (history.length > 0) {
        runningCount -= history.pop();
        cardsSeen = Math.max(0, cardsSeen - 1);
        localStorage.setItem("runningCount", runningCount);
        localStorage.setItem("cardsSeen", cardsSeen);
        updateDisplay();
    }
};

incrementBtn.onclick = () => {
    addCard(1);
};

decrementBtn.onclick = () => {
    addCard(-1);
};

zeroBtn.onclick = () => {
    addCard(0);
};

function addCard(value) {
    runningCount += value;
    cardsSeen++;
    history.push(value);
    localStorage.setItem("runningCount", runningCount);
    localStorage.setItem("cardsSeen", cardsSeen);
    updateDisplay();
};


//SCREEN AND DISPLAY FUNCTIONS
function updateDisplay() {
    runningCountSpan.textContent = runningCount;
    cardsSeenSpan.textContent = cardsSeen;
    
    const decksRemaining = Math.max(decks - cardsSeen/52, 0.25);
    const trueCount = runningCount/decksRemaining;
    trueCountSpan.textContent = isNaN(trueCount) ? 0 : trueCount.toFixed(2);

    //Suggestion implementation
    let suggestion = "N/A";
    let color = "";

    if (trueCount <= 0) {
        suggestion = "Bet minimum";
        color = "red";
    } else if (trueCount <= 2) {
        suggestion = "Small bet";
        color = "yellow";
    } else if (trueCount <= 5) {
        suggestion = "Raise bet";
        color = "green";
    } else {
        suggestion = "Max bet";
        color = "blue";
    }
    betSuggestionSpan.textContent = suggestion;
    betSuggestionSpan.className = `bet-suggestion ${color}`;
}

function showCounterScreen() {
    deckInputScreen.style.display = "none";
    counterScreen.style.display = "block";
}

function showDeckInputScreen() {
    deckInputScreen.style.display = "block";
    counterScreen.style.display = "none";
}