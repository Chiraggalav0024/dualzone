// Tab switching
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.target;

        tabButtons.forEach((b) => b.classList.remove("active"));
        tabPanels.forEach((p) => p.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(target).classList.add("active");
    });
});

// ---------- Tic Tac Toe ----------
const tttCells = document.querySelectorAll(".ttt-cell");
const tttStatus = document.getElementById("ttt-status");
const tttResetBtn = document.getElementById("ttt-reset");

let tttBoard = Array(9).fill(null);
let tttCurrent = "X";
let tttGameOver = false;

const tttWinPatterns = [
    [0, 1, 2],
[3, 4, 5],
[6, 7, 8],
[0, 3, 6],
[1, 4, 7],
[2, 5, 8],
[0, 4, 8],
[2, 4, 6]
];

function tttCheckWinner() {
    for (const [a, b, c] of tttWinPatterns) {
        if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
            tttCells[a].classList.add("winning");
            tttCells[b].classList.add("winning");
            tttCells[c].classList.add("winning");
            return tttBoard[a];
        }
    }
    if (tttBoard.every((v) => v)) return "draw";
    return null;
}

tttCells.forEach((cell) => {
    cell.addEventListener("click", () => {
        if (tttGameOver) return;
        const idx = Number(cell.dataset.index);
        if (tttBoard[idx]) return;

        tttBoard[idx] = tttCurrent;
        cell.textContent = tttCurrent;

        const result = tttCheckWinner();
        if (result === "X" || result === "O") {
            tttStatus.textContent = `Winner: ${result}`;
            tttGameOver = true;
        } else if (result === "draw") {
            tttStatus.textContent = "It's a draw.";
            tttGameOver = true;
        } else {
            tttCurrent = tttCurrent === "X" ? "O" : "X";
            tttStatus.textContent = `Turn: ${tttCurrent}`;
        }
    });
});

tttResetBtn.addEventListener("click", () => {
    tttBoard = Array(9).fill(null);
    tttCurrent = "X";
    tttGameOver = false;
    tttStatus.textContent = "Turn: X";
    tttCells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("winning");
    });
});

// ---------- Rock Paper Scissors ----------
const rpsChoices = ["rock", "paper", "scissors"];

let rpsP1Choice = null;
let rpsP2Choice = null;

const rpsStatus = document.getElementById("rps-status");
const rpsP1Span = document.getElementById("rps-p1-choice");
const rpsP2Span = document.getElementById("rps-p2-choice");
const rpsRevealBtn = document.getElementById("rps-reveal");
const rpsResetBtn = document.getElementById("rps-reset");

const rpsOptionGroups = document.querySelectorAll(".rps-options");

rpsOptionGroups.forEach((group) => {
    group.addEventListener("click", (e) => {
        if (!(e.target instanceof HTMLButtonElement)) return;
        const choice = e.target.dataset.choice;
        if (!rpsChoices.includes(choice)) return;

        group.querySelectorAll("button").forEach((btn) => btn.classList.remove("selected"));
        e.target.classList.add("selected");

        const player = group.dataset.player;
        if (player === "1") {
            rpsP1Choice = choice;
            rpsP1Span.textContent = "● chosen";
        } else {
            rpsP2Choice = choice;
            rpsP2Span.textContent = "● chosen";
        }
        rpsStatus.textContent = "Both players choose, then click Reveal.";
    });
});

function rpsWinner(p1, p2) {
    if (p1 === p2) return "draw";
    if (
        (p1 === "rock" && p2 === "scissors") ||
        (p1 === "paper" && p2 === "rock") ||
        (p1 === "scissors" && p2 === "paper")
    ) {
        return "p1";
    }
    return "p2";
}

rpsRevealBtn.addEventListener("click", () => {
    if (!rpsP1Choice || !rpsP2Choice) {
        rpsStatus.textContent = "Both players must choose first.";
        return;
    }
    rpsP1Span.textContent = rpsP1Choice;
    rpsP2Span.textContent = rpsP2Choice;

    const result = rpsWinner(rpsP1Choice, rpsP2Choice);
    if (result === "draw") {
        rpsStatus.textContent = "Result: Draw!";
    } else if (result === "p1") {
        rpsStatus.textContent = "Result: Player 1 wins!";
    } else {
        rpsStatus.textContent = "Result: Player 2 wins!";
    }
});

rpsResetBtn.addEventListener("click", () => {
    rpsP1Choice = null;
    rpsP2Choice = null;
    rpsP1Span.textContent = "?";
    rpsP2Span.textContent = "?";
    rpsStatus.textContent = "Waiting for choices...";
    rpsOptionGroups.forEach((group) =>
    group.querySelectorAll("button").forEach((btn) => btn.classList.remove("selected"))
    );
});

// ---------- Dice Duel ----------
const diceP1El = document.getElementById("dice-p1");
const diceP2El = document.getElementById("dice-p2");
const diceStatus = document.getElementById("dice-status");
const diceRollP1Btn = document.getElementById("dice-roll-p1");
const diceRollP2Btn = document.getElementById("dice-roll-p2");
const diceResetBtn = document.getElementById("dice-reset");
const diceScoreP1El = document.getElementById("dice-score-p1");
const diceScoreP2El = document.getElementById("dice-score-p2");

let diceP1Val = null;
let diceP2Val = null;
let diceScoreP1 = 0;
let diceScoreP2 = 0;

function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

function updateDiceStatus() {
    if (diceP1Val == null || diceP2Val == null) {
        diceStatus.textContent = "Click Roll for each player.";
        return;
    }
    if (diceP1Val === diceP2Val) {
        diceStatus.textContent = "Round result: Draw.";
    } else if (diceP1Val > diceP2Val) {
        diceStatus.textContent = "Round result: Player 1 wins!";
    } else {
        diceStatus.textContent = "Round result: Player 2 wins!";
    }
}

diceRollP1Btn.addEventListener("click", () => {
    diceP1Val = rollDie();
    diceP1El.textContent = diceP1Val;
    if (diceP2Val != null) {
        if (diceP1Val > diceP2Val) diceScoreP1++;
        else if (diceP2Val > diceP1Val) diceScoreP2++;
        diceScoreP1El.textContent = diceScoreP1;
        diceScoreP2El.textContent = diceScoreP2;
    }
    updateDiceStatus();
});

diceRollP2Btn.addEventListener("click", () => {
    diceP2Val = rollDie();
    diceP2El.textContent = diceP2Val;
    if (diceP1Val != null) {
        if (diceP1Val > diceP2Val) diceScoreP1++;
        else if (diceP2Val > diceP1Val) diceScoreP2++;
        diceScoreP1El.textContent = diceScoreP1;
        diceScoreP2El.textContent = diceScoreP2;
    }
    updateDiceStatus();
});

diceResetBtn.addEventListener("click", () => {
    diceP1Val = null;
    diceP2Val = null;
    diceScoreP1 = 0;
    diceScoreP2 = 0;
    diceP1El.textContent = "-";
    diceP2El.textContent = "-";
    diceScoreP1El.textContent = "0";
    diceScoreP2El.textContent = "0";
    diceStatus.textContent = "Click Roll for each player.";
});
