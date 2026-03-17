/* ===================================================
   DUAL — 2 Player Games | games.js
   Games: Tic-Tac-Toe, Connect Four, Dual Snake, Pong, RPS
=================================================== */

/* ========== GLOBAL STATE ========== */
let sessionWins = { p1: 0, p2: 0 };

function goHome() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('landing').classList.add('active');
  stopAllLoops();
}

function launchGame(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  stopAllLoops();
  if (id === 'ttt') initTTT();
  else if (id === 'connect4') initC4();
  else if (id === 'snake') initSnake();
  else if (id === 'pong') initPong();
  else if (id === 'rps') initRPS();
}

function addSessionWin(player) {
  sessionWins[`p${player}`]++;
  document.getElementById('p1wins').textContent = sessionWins.p1;
  document.getElementById('p2wins').textContent = sessionWins.p2;
}

let loops = {};
function stopAllLoops() {
  Object.values(loops).forEach(id => { clearInterval(id); cancelAnimationFrame(id); });
  loops = {};
}

/* ========================================================
   GAME 1: TIC-TAC-TOE
======================================================== */
let tttBoard, tttCurrent, tttOver;

function initTTT() {
  tttBoard = Array(9).fill(null);
  tttCurrent = 'X';
  tttOver = false;
  document.getElementById('tttStatus').textContent = '';
  document.getElementById('tttTurn').textContent = "Player 1's Turn (✕)";
  renderTTT();
}

function renderTTT() {
  const el = document.getElementById('tttBoard');
  el.innerHTML = '';
  tttBoard.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'ttt-cell' + (val ? ` ${val.toLowerCase()} taken` : '');
    cell.textContent = val === 'X' ? '✕' : val === 'O' ? '○' : '';
    if (!val && !tttOver) cell.onclick = () => tttMove(i);
    el.appendChild(cell);
  });
}

function tttMove(i) {
  if (tttBoard[i] || tttOver) return;
  tttBoard[i] = tttCurrent;
  const win = checkTTTWin();
  if (win) {
    tttOver = true;
    renderTTT();
    win.forEach(idx => document.querySelectorAll('.ttt-cell')[idx].classList.add('winning'));
    const player = tttCurrent === 'X' ? 1 : 2;
    document.getElementById('tttStatus').textContent = `PLAYER ${player} WINS! 🎉`;
    document.getElementById('tttTurn').textContent = '';
    addSessionWin(player);
    return;
  }
  if (!tttBoard.includes(null)) {
    tttOver = true;
    document.getElementById('tttStatus').textContent = "IT'S A DRAW!";
    document.getElementById('tttTurn').textContent = '';
    renderTTT();
    return;
  }
  tttCurrent = tttCurrent === 'X' ? 'O' : 'X';
  const pName = tttCurrent === 'X' ? '1' : '2';
  const sym = tttCurrent === 'X' ? '✕' : '○';
  document.getElementById('tttTurn').textContent = `Player ${pName}'s Turn (${sym})`;
  renderTTT();
}

function checkTTTWin() {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const line of lines) {
    const [a,b,c] = line;
    if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) return line;
  }
  return null;
}

function resetTTT() { initTTT(); }

/* ========================================================
   GAME 2: CONNECT FOUR
======================================================== */
const C4_ROWS = 6, C4_COLS = 7;
let c4Grid, c4Player, c4Over;

function initC4() {
  c4Grid = Array.from({ length: C4_ROWS }, () => Array(C4_COLS).fill(0));
  c4Player = 1;
  c4Over = false;
  document.getElementById('c4Status').textContent = '';
  document.getElementById('c4Turn').textContent = "Player 1's Turn";
  buildC4Buttons();
  drawC4();
}

function buildC4Buttons() {
  const el = document.getElementById('c4Cols');
  el.innerHTML = '';
  for (let c = 0; c < C4_COLS; c++) {
    const btn = document.createElement('button');
    btn.className = 'c4-col-btn';
    btn.textContent = '▼';
    btn.style.width = '64px';
    btn.onclick = () => c4Drop(c);
    el.appendChild(btn);
  }
}

function drawC4() {
  const canvas = document.getElementById('c4Canvas');
  const ctx = canvas.getContext('2d');
  const CW = 70, CH = 70;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < C4_ROWS; r++) {
    for (let c = 0; c < C4_COLS; c++) {
      const x = c * CW + CW / 2 + 3;
      const y = r * CH + CH / 2 + 3;
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      if (c4Grid[r][c] === 1) ctx.fillStyle = '#ff3c3c';
      else if (c4Grid[r][c] === 2) ctx.fillStyle = '#00e5ff';
      else ctx.fillStyle = '#1a1a1a';
      ctx.fill();
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

function c4Drop(col) {
  if (c4Over) return;
  let row = -1;
  for (let r = C4_ROWS - 1; r >= 0; r--) {
    if (c4Grid[r][col] === 0) { row = r; break; }
  }
  if (row === -1) return;
  c4Grid[row][col] = c4Player;
  drawC4();
  const win = checkC4Win(row, col);
  if (win) {
    c4Over = true;
    highlightC4Win(win);
    document.getElementById('c4Status').textContent = `PLAYER ${c4Player} WINS! 🎉`;
    document.getElementById('c4Turn').textContent = '';
    addSessionWin(c4Player);
    return;
  }
  if (c4Grid[0].every(v => v !== 0)) {
    c4Over = true;
    document.getElementById('c4Status').textContent = "IT'S A DRAW!";
    return;
  }
  c4Player = c4Player === 1 ? 2 : 1;
  document.getElementById('c4Turn').textContent = `Player ${c4Player}'s Turn`;
}

function checkC4Win(row, col) {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  const p = c4Grid[row][col];
  for (const [dr, dc] of dirs) {
    let cells = [[row, col]];
    for (let d of [1, -1]) {
      let r = row + dr * d, c = col + dc * d;
      while (r >= 0 && r < C4_ROWS && c >= 0 && c < C4_COLS && c4Grid[r][c] === p) {
        cells.push([r, c]);
        r += dr * d; c += dc * d;
      }
    }
    if (cells.length >= 4) return cells;
  }
  return null;
}

function highlightC4Win(cells) {
  const canvas = document.getElementById('c4Canvas');
  const ctx = canvas.getContext('2d');
  const CW = 70, CH = 70;
  cells.forEach(([r, c]) => {
    const x = c * CW + CW / 2 + 3;
    const y = r * CH + CH / 2 + 3;
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#ffe600';
    ctx.fill();
  });
}

function resetC4() { initC4(); }

/* ========================================================
   GAME 3: DUAL SNAKE
======================================================== */
const CELL = 20, COLS_S = 30, ROWS_S = 20;
let snake1, snake2, dir1, dir2, food, snakeOver;
let snakeLoop;

function initSnake() {
  snake1 = [{x: 5, y: 10}, {x: 4, y: 10}, {x: 3, y: 10}];
  snake2 = [{x: 24, y: 10}, {x: 25, y: 10}, {x: 26, y: 10}];
  dir1 = {x: 1, y: 0};
  dir2 = {x: -1, y: 0};
  snakeOver = false;
  document.getElementById('snakeStatus').textContent = 'Press START to play!';
  document.getElementById('s1score').textContent = '0';
  document.getElementById('s2score').textContent = '0';
  placeFood();
  drawSnake();
  document.addEventListener('keydown', snakeKeyHandler);
}

function resetSnake() {
  clearInterval(snakeLoop);
  document.removeEventListener('keydown', snakeKeyHandler);
  initSnake();
  snakeLoop = setInterval(snakeTick, 120);
  loops.snake = snakeLoop;
  document.getElementById('snakeStatus').textContent = '';
}

function snakeKeyHandler(e) {
  const keys = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
                  w: 'W', s: 'S', a: 'A', d: 'D', W: 'W', S: 'S', A: 'A', D: 'D' };
  if (!keys[e.key]) return;
  e.preventDefault();
  const k = keys[e.key];
  if (k === 'W' && dir1.y !== 1) dir1 = {x: 0, y: -1};
  if (k === 'S' && dir1.y !== -1) dir1 = {x: 0, y: 1};
  if (k === 'A' && dir1.x !== 1) dir1 = {x: -1, y: 0};
  if (k === 'D' && dir1.x !== -1) dir1 = {x: 1, y: 0};
  if (k === 'UP' && dir2.y !== 1) dir2 = {x: 0, y: -1};
  if (k === 'DOWN' && dir2.y !== -1) dir2 = {x: 0, y: 1};
  if (k === 'LEFT' && dir2.x !== 1) dir2 = {x: -1, y: 0};
  if (k === 'RIGHT' && dir2.x !== -1) dir2 = {x: 1, y: 0};
}

function placeFood() {
  const used = new Set([...snake1, ...snake2].map(p => `${p.x},${p.y}`));
  let pos;
  do { pos = {x: Math.floor(Math.random()*COLS_S), y: Math.floor(Math.random()*ROWS_S)}; }
  while (used.has(`${pos.x},${pos.y}`));
  food = pos;
}

function snakeTick() {
  if (snakeOver) return;
  const h1 = {x: snake1[0].x + dir1.x, y: snake1[0].y + dir1.y};
  const h2 = {x: snake2[0].x + dir2.x, y: snake2[0].y + dir2.y};

  const oob1 = h1.x < 0 || h1.x >= COLS_S || h1.y < 0 || h1.y >= ROWS_S;
  const oob2 = h2.x < 0 || h2.x >= COLS_S || h2.y < 0 || h2.y >= ROWS_S;
  const hit1Self = snake1.some(s => s.x === h1.x && s.y === h1.y);
  const hit2Self = snake2.some(s => s.x === h2.x && s.y === h2.y);
  const hit1on2 = snake2.some(s => s.x === h1.x && s.y === h1.y);
  const hit2on1 = snake1.some(s => s.x === h2.x && s.y === h2.y);

  const dead1 = oob1 || hit1Self || hit1on2;
  const dead2 = oob2 || hit2Self || hit2on1;

  if (dead1 && dead2) { endSnake(0); return; }
  if (dead1) { endSnake(2); return; }
  if (dead2) { endSnake(1); return; }

  snake1.unshift(h1);
  snake2.unshift(h2);

  let ate = false;
  if (h1.x === food.x && h1.y === food.y) {
    document.getElementById('s1score').textContent = snake1.length - 3;
    ate = true;
  } else snake1.pop();

  if (h2.x === food.x && h2.y === food.y) {
    document.getElementById('s2score').textContent = snake2.length - 3;
    ate = true;
  } else snake2.pop();

  if (ate) placeFood();
  drawSnake();
}

function endSnake(winner) {
  snakeOver = true;
  clearInterval(snakeLoop);
  if (winner === 0) {
    document.getElementById('snakeStatus').textContent = "DRAW!";
  } else {
    document.getElementById('snakeStatus').textContent = `PLAYER ${winner} WINS! 🎉`;
    addSessionWin(winner);
  }
  drawSnake();
}

function drawSnake() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid dots
  ctx.fillStyle = '#111';
  for (let x = 0; x < COLS_S; x++)
    for (let y = 0; y < ROWS_S; y++) {
      ctx.fillRect(x * CELL + CELL/2 - 1, y * CELL + CELL/2 - 1, 2, 2);
    }

  // Food
  ctx.fillStyle = '#ffe600';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ffe600';
  ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
  ctx.shadowBlur = 0;

  // Snake 1
  snake1.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? '#ff6060' : '#ff3c3c';
    ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
  });

  // Snake 2
  snake2.forEach((seg, i) => {
    ctx.fillStyle = i === 0 ? '#60f0ff' : '#00e5ff';
    ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
  });
}

/* ========================================================
   GAME 4: PONG
======================================================== */
const PW = 700, PH = 400;
const PAD_W = 12, PAD_H = 80;
let pong, pongRunning;
let pongAnimId;

function initPong() {
  pong = {
    p1: { y: PH/2 - PAD_H/2, score: 0, dy: 0 },
    p2: { y: PH/2 - PAD_H/2, score: 0, dy: 0 },
    ball: { x: PW/2, y: PH/2, vx: 4, vy: 3 },
    keys: {}
  };
  pongRunning = false;
  drawPong();
  document.addEventListener('keydown', pongKeyDown);
  document.addEventListener('keyup', pongKeyUp);
  document.getElementById('pongStatus').textContent = 'Press START to play!';
}

function resetPong() {
  pongRunning = false;
  cancelAnimationFrame(pongAnimId);
  document.removeEventListener('keydown', pongKeyDown);
  document.removeEventListener('keyup', pongKeyUp);
  initPong();
  pongRunning = true;
  document.getElementById('pongStatus').textContent = '';
  pongLoop();
}

function pongKeyDown(e) { pong.keys[e.key] = true; if(['w','s','ArrowUp','ArrowDown'].includes(e.key)) e.preventDefault(); }
function pongKeyUp(e) { pong.keys[e.key] = false; }

function pongLoop() {
  if (!pongRunning) return;
  updatePong();
  drawPong();
  pongAnimId = requestAnimationFrame(pongLoop);
  loops.pong = pongAnimId;
}

function updatePong() {
  const PAD_SPEED = 6;
  if (pong.keys['w'] || pong.keys['W']) pong.p1.y = Math.max(0, pong.p1.y - PAD_SPEED);
  if (pong.keys['s'] || pong.keys['S']) pong.p1.y = Math.min(PH - PAD_H, pong.p1.y + PAD_SPEED);
  if (pong.keys['ArrowUp']) pong.p2.y = Math.max(0, pong.p2.y - PAD_SPEED);
  if (pong.keys['ArrowDown']) pong.p2.y = Math.min(PH - PAD_H, pong.p2.y + PAD_SPEED);

  pong.ball.x += pong.ball.vx;
  pong.ball.y += pong.ball.vy;

  if (pong.ball.y <= 5 || pong.ball.y >= PH - 5) pong.ball.vy *= -1;

  // P1 paddle collision
  if (pong.ball.x <= 30 + PAD_W && pong.ball.x >= 30 &&
      pong.ball.y >= pong.p1.y && pong.ball.y <= pong.p1.y + PAD_H) {
    pong.ball.vx = Math.abs(pong.ball.vx) * 1.05;
    const rel = (pong.ball.y - (pong.p1.y + PAD_H/2)) / (PAD_H/2);
    pong.ball.vy = rel * 6;
  }

  // P2 paddle collision
  if (pong.ball.x >= PW - 30 - PAD_W && pong.ball.x <= PW - 30 &&
      pong.ball.y >= pong.p2.y && pong.ball.y <= pong.p2.y + PAD_H) {
    pong.ball.vx = -Math.abs(pong.ball.vx) * 1.05;
    const rel = (pong.ball.y - (pong.p2.y + PAD_H/2)) / (PAD_H/2);
    pong.ball.vy = rel * 6;
  }

  // Clamp ball speed
  const speed = Math.sqrt(pong.ball.vx**2 + pong.ball.vy**2);
  if (speed > 12) { pong.ball.vx *= 12/speed; pong.ball.vy *= 12/speed; }

  // Score
  if (pong.ball.x < 0) {
    pong.p2.score++;
    if (pong.p2.score >= 7) { endPong(2); return; }
    resetBall();
  }
  if (pong.ball.x > PW) {
    pong.p1.score++;
    if (pong.p1.score >= 7) { endPong(1); return; }
    resetBall();
  }
}

function resetBall() {
  pong.ball = { x: PW/2, y: PH/2, vx: (Math.random() > 0.5 ? 4 : -4), vy: (Math.random() * 4 - 2) };
}

function endPong(winner) {
  pongRunning = false;
  cancelAnimationFrame(pongAnimId);
  document.getElementById('pongStatus').textContent = `PLAYER ${winner} WINS! 🎉`;
  addSessionWin(winner);
  drawPong();
}

function drawPong() {
  const canvas = document.getElementById('pongCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, PW, PH);
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, PW, PH);

  // Center line
  ctx.strokeStyle = '#1f1f1f';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  ctx.beginPath(); ctx.moveTo(PW/2, 0); ctx.lineTo(PW/2, PH); ctx.stroke();
  ctx.setLineDash([]);

  // Scores
  ctx.font = '900 60px Bebas Neue, sans-serif';
  ctx.fillStyle = '#ff3c3c';
  ctx.textAlign = 'right';
  ctx.fillText(pong ? pong.p1.score : '0', PW/2 - 40, 70);
  ctx.fillStyle = '#00e5ff';
  ctx.textAlign = 'left';
  ctx.fillText(pong ? pong.p2.score : '0', PW/2 + 40, 70);

  if (!pong) return;

  // Paddles
  ctx.fillStyle = '#ff3c3c';
  ctx.shadowBlur = 8; ctx.shadowColor = '#ff3c3c';
  ctx.fillRect(30, pong.p1.y, PAD_W, PAD_H);
  ctx.fillStyle = '#00e5ff';
  ctx.shadowColor = '#00e5ff';
  ctx.fillRect(PW - 30 - PAD_W, pong.p2.y, PAD_W, PAD_H);
  ctx.shadowBlur = 0;

  // Ball
  ctx.fillStyle = '#ffe600';
  ctx.shadowBlur = 12; ctx.shadowColor = '#ffe600';
  ctx.beginPath();
  ctx.arc(pong.ball.x, pong.ball.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // First to 7 label
  ctx.font = '11px Space Mono, monospace';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.fillText('FIRST TO 7', PW/2, PH - 10);
}

/* ========================================================
   GAME 5: ROCK PAPER SCISSORS
======================================================== */
let rpsScore, rpsChoices, rpsRound;

function initRPS() {
  rpsScore = { p1: 0, p2: 0 };
  rpsChoices = { p1: null, p2: null };
  rpsRound = 1;
  document.getElementById('rps1pts').textContent = '0';
  document.getElementById('rps2pts').textContent = '0';
  document.getElementById('rpsResult').textContent = '';
  enableRPSButtons();
}

function enableRPSButtons() {
  document.querySelectorAll('.rps-btn').forEach(b => { b.disabled = false; b.classList.remove('chosen'); });
  rpsChoices = { p1: null, p2: null };
}

function rpsChoose(player, choice) {
  if (rpsChoices[`p${player}`]) return;
  rpsChoices[`p${player}`] = choice;

  // Mark chosen buttons for that player
  const section = document.getElementById(`rpsP${player}Section`);
  section.querySelectorAll('.rps-btn').forEach(b => {
    if (b.textContent.toLowerCase().includes(choice)) b.classList.add('chosen');
    b.disabled = true;
  });

  if (rpsChoices.p1 && rpsChoices.p2) {
    setTimeout(() => resolveRPS(), 400);
  }
}

function resolveRPS() {
  const c1 = rpsChoices.p1, c2 = rpsChoices.p2;
  const beats = { rock: 'scissors', scissors: 'paper', paper: 'rock' };
  const emojis = { rock: '✊', paper: '✋', scissors: '✌️' };

  let result = '';
  let winner = 0;

  if (c1 === c2) {
    result = `${emojis[c1]} vs ${emojis[c2]} — DRAW!`;
  } else if (beats[c1] === c2) {
    rpsScore.p1++;
    winner = 1;
    result = `${emojis[c1]} BEATS ${emojis[c2]} — P1 WINS ROUND!`;
  } else {
    rpsScore.p2++;
    winner = 2;
    result = `${emojis[c1]} LOSES TO ${emojis[c2]} — P2 WINS ROUND!`;
  }

  document.getElementById('rps1pts').textContent = rpsScore.p1;
  document.getElementById('rps2pts').textContent = rpsScore.p2;
  document.getElementById('rpsResult').textContent = result;

  if (rpsScore.p1 >= 3 || rpsScore.p2 >= 3) {
    const w = rpsScore.p1 >= 3 ? 1 : 2;
    setTimeout(() => {
      document.getElementById('rpsResult').textContent = `🏆 PLAYER ${w} WINS THE MATCH!`;
      addSessionWin(w);
    }, 600);
    return;
  }

  setTimeout(() => {
    document.getElementById('rpsResult').textContent = '';
    enableRPSButtons();
  }, 1800);
}

function resetRPS() { initRPS(); }

/* ========== INIT ========== */
window.addEventListener('load', () => {
  document.getElementById('landing').classList.add('active');
});
