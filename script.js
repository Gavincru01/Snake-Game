//  Setup

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameLoop; // interval reference
let dx = 20; // snake movement step in x
let dy = 0; // snake movement step in y
let snake; // snake body (array of x,y objects)

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

function startGame() {
  initSnake();
  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(main, 150);
}

function resetGame() {
  startGame();
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
  snake.forEach((part, index) => {
    if (index === 0) {
      // Snake Head

      ctx.fillStyle = "green";
      ctx.fillRect(part.x, part.y, 22, 22); // bigger head

      // Eyes 👀
      ctx.fillStyle = "black";
      ctx.fillRect(part.x + 4, part.y + 4, 4, 4); // left eye
      ctx.fillRect(part.x + 14, part.y + 4, 4, 4); // right eye
    } else {
      // Snake Body

      ctx.fillStyle = "light-green";
      ctx.fillRect(part.x + 1, part.y + 1, 18, 18); // spacing makes it "segmented"

      // Optional border
      ctx.strokeStyle = "dark-green";
      ctx.strokeRect(part.x + 1, part.y + 1, 18, 18);
    }
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

// Start Button

document.getElementById("startBtn").addEventListener("click", startGame);
//  Restart Button

document.getElementById("restartBtn").addEventListener("click", resetGame);

//  Start First Game
