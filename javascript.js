const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');
const gameModeSelect = document.getElementById('gameMode');

let currentPlayer = "X";
let options = ["", "", "", "", "", "", "", "", ""];
let running = true;
let scores = { X: 0, O: 0, draws: 0 };

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    restartBtn.addEventListener('click', restartGame);
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function cellClicked() {
    const cellIndex = this.getAttribute('data-index');

    if (options[cellIndex] !== "" || !running) return;

    updateCell(this, cellIndex);
    checkWinner();

    if (running && gameModeSelect.value === 'pva' && currentPlayer === "O") {
        setTimeout(aiTurn, 500);
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWinner() {
    let roundWon = false;
    let winningLine = null;

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (options[a] && options[a] === options[b] && options[a] === options[c]) {
            roundWon = true;
            winningLine = winConditions[i];
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        highlightWinner(winningLine);
        updateScoreboard(currentPlayer);
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = `Draw!`;
        updateScoreboard('draw');
        running = false;
    } else {
        changePlayer();
    }
}

function highlightWinner(line) {
    line.forEach(index => cells[index].classList.add('winner'));
}

function updateScoreboard(winner) {
    if (winner === 'X') scores.X++;
    else if (winner === 'O') scores.O++;
    else scores.draws++;

    document.getElementById('scoreX').textContent = scores.X;
    document.getElementById('scoreO').textContent = scores.O;
    document.getElementById('draws').textContent = scores.draws;
}

function aiTurn() {
    const availableIndices = options.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    if (availableIndices.length > 0) {
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const cell = document.querySelector(`[data-index="${randomIndex}"]`);
        updateCell(cell, randomIndex);
        checkWinner();
    }
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `Player X's Turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.className = 'cell';
    });
    running = true;
}