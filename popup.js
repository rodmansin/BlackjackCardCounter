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
const plusBtn = document.getElementById("plusBtn");
const minusBtn = document.getElementById("minusBtn");
const zeroBtn = document.getElementById("zeroBtn");

// Game variables
let runningCount = 0;
let decks = null;
let cardsSeen = 0;
let history = [];   //For undo button (not saved in session)

//Restore previous session data (if it exists)
if (sessionStorage.getItem("runningCount") !== null && sessionStorage.getItem("decks") !== null) {
    runningCount = parseInt(sessionStorage.getItem("runningCount"));
    decks = parseInt(sessionStorage.getItem("decks"));
    cardsSeen = parseInt(sessionStorage.getItem("cardsSeen"));
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
        sessionStorage.setItem("decks", decks);
        sessionStorage.setItem("runningCount", runningCount);
        sessionStorage.setItem("cardsSeen", cardsSeen);
        showCounterScreen();
        updateDisplay();
    }
};

resetBtn.onclick = () => {
    sessionStorage.clear();
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
        sessionStorage.setItem("runningCount", runningCount);
        sessionStorage.setItem("cardsSeen", cardsSeen);
        updateDisplay();
    }
};

plusBtn.onclick = () => {
    addCard(1);
};

minusBtn.onclick = () => {
    addCard(-1);
};

zeroBtn.onclick = () => {
    addCard(0);
};

function addCard(value) {
    runningCount += value;
    cardsSeen++;
    history.push(value);
    sessionStorage.setItem("runningCount", runningCount);
    sessionStorage.setItem("cardsSeen", cardsSeen);
    updateDisplay();
};


//SCREEN AND DISPLAY FUNCTIONS
function updateDisplay() {
    runningCountSpan.textContent = runningCount;
    cardsSeenSpan.textContent = cardsSeen;
    
    const decksRemaining = Math.max(decks - cardsSeen/52, 0.25);
    const trueCount = Math.floor(runningCount/decksRemaining);
    trueCountSpan.textContent = isNaN(trueCount) ? 0 : trueCount;

    //Suggestion implementation
    let suggestion = "N/A";
    let color = "";

    if (trueCount <= 0) {
        suggestion = "Bet minimum";
        color = "red";
    } else if (trueCount <= 2) {
        suggestion = "Small bet";
        color = "yellow"
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