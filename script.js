//  Setup

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameLoop; // interval reference
let dx = 20; // snake movement step in x
let dy = 0; // snake movement step in y
let snake; // snake body (array of x,y objects)

//  Game Initialization

function resetGame() {
  // Reset snake to starting position
  snake = [
    { x: 50, y: 50 },
    { x: 30, y: 50 },
    { x: 10, y: 50 },
  ];

  // Reset direction
  dx = 20;
  dy = 0;

  // Clear old game loop if it exists
  if (gameLoop) clearInterval(gameLoop);

  // Start a new game loop
  gameLoop = setInterval(main, 100);
}

//  Core Loop

function main() {
  moveSnake();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  checkCollision();
}

//  Snake Behavior

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Add new head
  snake.unshift(head);

  // Remove tail (for now, until we add food/growth)
  snake.pop();
}

function drawSnake() {
  ctx.fillStyle = "green";
  snake.forEach((part) => {
    ctx.fillRect(part.x, part.y, 20, 20);
  });
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

//  Restart Button

document.getElementById("restartBtn").addEventListener("click", resetGame);

//  Start First Game

resetGame();
