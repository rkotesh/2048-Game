const gridContainer = document.getElementById('grid-container');
const scoreDisplay = document.getElementById('score');
const bestDisplay = document.getElementById('best');
const newGameBtn = document.getElementById('new-game');

document.getElementById('up').addEventListener('click', () => keyControl({ key: 'ArrowUp' }));
document.getElementById('down').addEventListener('click', () => keyControl({ key: 'ArrowDown' }));
document.getElementById('left').addEventListener('click', () => keyControl({ key: 'ArrowLeft' }));
document.getElementById('right').addEventListener('click', () => keyControl({ key: 'ArrowRight' }));

let grid = [];
let score = 0;
let best = localStorage.getItem('best') || 0;

function createGrid() {
  gridContainer.innerHTML = '';
  grid = [];

  for (let i = 0; i < 4; i++) {
    grid[i] = [];
    for (let j = 0; j < 4; j++) {
      grid[i][j] = 0;
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.id = `tile-${i}-${j}`;
      gridContainer.appendChild(tile);
    }
  }
}

function updateGrid() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const tile = document.getElementById(`tile-${i}-${j}`);
      tile.textContent = grid[i][j] === 0 ? '' : grid[i][j];
      tile.className = 'tile';
      if (grid[i][j] > 0) tile.classList.add(`tile-${grid[i][j]}`);
    }
  }
  scoreDisplay.textContent = score;
  bestDisplay.textContent = best;
}

function addRandomTile() {
  let emptyTiles = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) emptyTiles.push([i, j]);
    }
  }

  if (emptyTiles.length === 0) return;

  const [x, y] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  grid[x][y] = Math.random() < 0.9 ? 2 : 4;
}

function slide(row) {
  let arr = row.filter(val => val);
  let missing = 4 - arr.length;
  let zeros = Array(missing).fill(0);
  return arr.concat(zeros);
}

function combine(row) {
  for (let i = 0; i < 3; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  return row;
}

function operate(row) {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
}

function rotateGrid(grid) {
  return grid[0].map((_, i) => grid.map(row => row[i]).reverse());
}

function keyControl(e) {
  let played = false;
  switch (e.key) {
    case "ArrowLeft":
      for (let i = 0; i < 4; i++) {
        let newRow = operate(grid[i]);
        if (grid[i].toString() !== newRow.toString()) played = true;
        grid[i] = newRow;
      }
      break;
    case "ArrowRight":
      for (let i = 0; i < 4; i++) {
        let row = grid[i].slice().reverse();
        let newRow = operate(row).reverse();
        if (grid[i].toString() !== newRow.toString()) played = true;
        grid[i] = newRow;
      }
      break;
    case "ArrowUp":
      grid = rotateGrid(grid);
      for (let i = 0; i < 4; i++) {
        let newRow = operate(grid[i]);
        if (grid[i].toString() !== newRow.toString()) played = true;
        grid[i] = newRow;
      }
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      break;
    case "ArrowDown":
      grid = rotateGrid(grid);
      for (let i = 0; i < 4; i++) {
        let row = grid[i].slice().reverse();
        let newRow = operate(row).reverse();
        if (grid[i].toString() !== newRow.toString()) played = true;
        grid[i] = newRow;
      }
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      break;
  }

  if (played) {
    addRandomTile();
    updateGrid();
    if (score > best) {
      best = score;
      localStorage.setItem('best', best);
    }
    checkGameOver();
  }
}

function checkGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return;
      if (j !== 3 && grid[i][j] === grid[i][j + 1]) return;
      if (i !== 3 && grid[i][j] === grid[i + 1][j]) return;
    }
  }
  alert('Game Over!');
}

function startGame() {
  score = 0;
  createGrid();
  addRandomTile();
  addRandomTile();
  updateGrid();
}

document.addEventListener('keydown', keyControl);
newGameBtn.addEventListener('click', startGame);

startGame();