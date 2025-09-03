//  Setup

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 20;

let gameLoop;
let dx = cellSize;
let dy = 0;
let snake;
let score = 0;
let highScore = 0;
let fruit = { x: 0, y: 0 };

//  Game Initialization

function initSnake() {
  const startX = Math.floor(canvas.width / 2 / cellSize) * cellSize;
  const startY = Math.floor(canvas.height / 2 / cellSize) * cellSize;

  snake = [
    { x: startX, y: startY },
    { x: startX - cellSize, y: startY },
    { x: startX - cellSize * 2, y: startY },
  ];

  dx = cellSize;
  dy = 0;
}

function spawnFruit() {
  fruit.x = Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize;
  fruit.y = Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize;
}

function startGame() {
  initSnake();
  spawnFruit();
  if (gameLoop) clearInterval(gameLoop);
  score = 0;
  document.getElementById("score").textContent = "Score: " + score;

  // Slow snake down (Higher the number, slower the pace)
  gameLoop = setInterval(main, 150);
}

function resetGame() {
  startGame();
}

//  Core Loop

function main() {
  moveSnake();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFruit();
  drawSnake();
  checkCollision();

  // Display Score
  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("highScore").textContent = "High Score: " + highScore;
}

//  Snake Behavior

function moveSnake() {
  // Create new head in the direction of movement
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Check fruit collision
  if (head.x === fruit.x && head.y === fruit.y) {
    spawnFruit(); // new fruit
    score++; // increase score

    // Update high score if beaten
    if (score > highScore) {
      highScore = score;
    }
  } else {
    snake.pop();
  }
}

function drawSnake() {
  snake.forEach((part, index) => {
    if (index === 0) {
      // Snake Head

      const gradient = ctx.createLinearGradient(
        part.x,
        part.y,
        part.x + cellSize,
        part.y + cellSize
      );
      gradient.addColorStop(0, "#39ff14"); // neon green start
      gradient.addColorStop(1, "#00b300"); // deeper green end

      ctx.fillStyle = gradient;
      ctx.fillRect(part.x, part.y, cellSize, cellSize);

      // Head glow (subtle outline)
      ctx.strokeStyle = "lime";
      ctx.shadowColor = "#39ff14";
      ctx.shadowBlur = 10;
      ctx.strokeRect(part.x, part.y, cellSize, cellSize);
      ctx.shadowBlur = 0; // reset

      // Eyes

      ctx.fillStyle = "black";
      const eyeSize = Math.floor(cellSize / 5);
      if (dx > 0) {
        // Right
        ctx.fillRect(
          part.x + cellSize - eyeSize * 2,
          part.y + eyeSize,
          eyeSize,
          eyeSize
        );
        ctx.fillRect(
          part.x + cellSize - eyeSize * 2,
          part.y + cellSize - eyeSize * 2,
          eyeSize,
          eyeSize
        );
      } else if (dx < 0) {
        // Left
        ctx.fillRect(part.x + eyeSize, part.y + eyeSize, eyeSize, eyeSize);
        ctx.fillRect(
          part.x + eyeSize,
          part.y + cellSize - eyeSize * 2,
          eyeSize,
          eyeSize
        );
      } else if (dy < 0) {
        // Up
        ctx.fillRect(part.x + eyeSize, part.y + eyeSize, eyeSize, eyeSize);
        ctx.fillRect(
          part.x + cellSize - eyeSize * 2,
          part.y + eyeSize,
          eyeSize,
          eyeSize
        );
      } else if (dy > 0) {
        // Down
        ctx.fillRect(
          part.x + eyeSize,
          part.y + cellSize - eyeSize * 2,
          eyeSize,
          eyeSize
        );
        ctx.fillRect(
          part.x + cellSize - eyeSize * 2,
          part.y + cellSize - eyeSize * 2,
          eyeSize,
          eyeSize
        );
      }
    } else {
      // Snake Body

      const gradient = ctx.createLinearGradient(
        part.x,
        part.y,
        part.x + cellSize,
        part.y + cellSize
      );
      gradient.addColorStop(0, "#76ff7a"); // lighter neon
      gradient.addColorStop(1, "#39ff14"); // bright neon

      ctx.fillStyle = gradient;
      ctx.fillRect(part.x + 1, part.y + 1, cellSize - 2, cellSize - 2);

      // Body border glow
      ctx.strokeStyle = "#00ff7f";
      ctx.shadowColor = "#39ff14";
      ctx.shadowBlur = 8;
      ctx.strokeRect(part.x + 1, part.y + 1, cellSize - 2, cellSize - 2);
      ctx.shadowBlur = 0; // reset
    }
  });
}

//  Fruit (Apple)

function drawFruit() {
  ctx.fillStyle = "red";
  ctx.fillRect(fruit.x, fruit.y, cellSize, cellSize);
}

function checkFruitCollision() {
  const head = snake[0];
  if (head.x === fruit.x && head.y === fruit.y) {
    spawnFruit();
    // Snake grows: don't remove tail on next move
    snake.push({});
  }
}

// Grid

function drawGrid() {
  ctx.strokeStyle = "rgba(57, 255, 20, 0.15)"; // faint neon green
  ctx.shadowColor = "#39ff14";
  ctx.shadowBlur = 6;

  for (let x = 0; x <= canvas.width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.shadowBlur = 0; // reset so snake/fruit aren’t glowing too much
}

//  Input Handling

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -20;
  } else if (event.key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = 20;
  } else if (event.key === "ArrowLeft" && dx === 0) {
    dx = -20;
    dy = 0;
  } else if (event.key === "ArrowRight" && dx === 0) {
    dx = 20;
    dy = 0;
  }
}

//  Collision Detection

function checkCollision() {
  const head = snake[0];

  // Wall collision
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    gameOver();
  }

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
}

//  Game Over

function gameOver() {
  clearInterval(gameLoop);
  alert("Game Over! Click Restart to play again.");
}

//  Buttons

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", resetGame);
