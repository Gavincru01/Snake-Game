//  Setup

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameLoop;
let dx = 20;
let dy = 0;
let snake;
let fruit = { x: 0, y: 0 };

//  Game Initialization

function initSnake() {
  snake = [
    { x: 50, y: 50 },
    { x: 30, y: 50 },
    { x: 10, y: 50 },
  ];
  dx = 20;
  dy = 0;
}

function spawnFruit() {
  fruit.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
  fruit.y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
}

function startGame() {
  initSnake();
  spawnFruit();
  if (gameLoop) clearInterval(gameLoop);

  // Slow snake down (Higher the number, slower the pace)
  gameLoop = setInterval(main, 150);
}

function resetGame() {
  startGame();
}

//  Core Loop

function main() {
  moveSnake();
  checkFruitCollision();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFruit();
  drawSnake();
  checkCollision();
}

//  Snake Behavior

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Only remove tail if not eating fruit
  if (!(head.x === fruit.x && head.y === fruit.y)) {
    snake.pop();
  }
}

function drawSnake() {
  snake.forEach((part, index) => {
    if (index === 0) {
      // Snake Head

      ctx.fillStyle = "green";
      ctx.fillRect(part.x, part.y, 22, 22); // bigger head

      // Eyes (rotate with direction)
      ctx.fillStyle = "black";
      if (dx > 0) {
        // Right
        ctx.fillRect(part.x + 14, part.y + 4, 4, 4);
        ctx.fillRect(part.x + 14, part.y + 14, 4, 4);
      } else if (dx < 0) {
        // Left
        ctx.fillRect(part.x + 4, part.y + 4, 4, 4);
        ctx.fillRect(part.x + 4, part.y + 14, 4, 4);
      } else if (dy < 0) {
        // Up
        ctx.fillRect(part.x + 4, part.y + 4, 4, 4);
        ctx.fillRect(part.x + 14, part.y + 4, 4, 4);
      } else if (dy > 0) {
        // Down
        ctx.fillRect(part.x + 4, part.y + 14, 4, 4);
        ctx.fillRect(part.x + 14, part.y + 14, 4, 4);
      }
    } else {
      // Snake Body

      ctx.fillStyle = "lightgreen";
      ctx.fillRect(part.x + 1, part.y + 1, 18, 18); // Spaced for segmentation

      ctx.strokeStyle = "darkgreen";
      ctx.strokeRect(part.x + 1, part.y + 1, 18, 18);
    }
  });
}

//  Fruit (Apple)

function drawFruit() {
  // Apple body (circle)
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(fruit.x + 10, fruit.y + 10, 10, 0, Math.PI * 2);
  ctx.fill();

  // Stem
  ctx.fillStyle = "brown";
  ctx.fillRect(fruit.x + 8, fruit.y - 4, 4, 6);

  // Leaf
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.ellipse(fruit.x + 14, fruit.y - 2, 4, 2, 0, 0, Math.PI * 2);
  ctx.fill();
}

function checkFruitCollision() {
  const head = snake[0];
  if (head.x === fruit.x && head.y === fruit.y) {
    // Grow snake
    spawnFruit();
  }
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
