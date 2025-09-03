export class SnakeGame {
  private ctx: CanvasRenderingContext2D;
  private cellSize = 20;
  private gameLoop: any;
  private dx = this.cellSize;
  private dy = 0;
  private snake: { x: number; y: number }[] = [];
  private score = 0;
  private highScore = 0;
  private fruit = { x: 0, y: 0 };
  private paused = false;
  private directionChanged = false; // prevent multiple turns per frame

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // load saved high score
    const stored = localStorage.getItem('snakeHighScore');
    if (stored) this.highScore = parseInt(stored);

    // keyboard controls
    document.addEventListener('keydown', this.changeDirection.bind(this));
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ') this.togglePause();
    });
  }

  // set up starting snake
  private initSnake() {
    const startX = Math.floor(this.canvas.width / 2 / this.cellSize) * this.cellSize;
    const startY = Math.floor(this.canvas.height / 2 / this.cellSize) * this.cellSize;

    this.snake = [
      { x: startX, y: startY },
      { x: startX - this.cellSize, y: startY },
      { x: startX - this.cellSize * 2, y: startY },
    ];

    this.dx = this.cellSize;
    this.dy = 0;
  }

  // place fruit at random cell
  private spawnFruit() {
    this.fruit.x = Math.floor(Math.random() * (this.canvas.width / this.cellSize)) * this.cellSize;
    this.fruit.y = Math.floor(Math.random() * (this.canvas.height / this.cellSize)) * this.cellSize;
  }

  // start or restart game
  public startGame(speed: number = 100) {
    this.initSnake();
    this.spawnFruit();
    if (this.gameLoop) clearInterval(this.gameLoop);
    this.score = 0;
    this.updateScore();
    this.hideGameOver();

    this.gameLoop = setInterval(() => this.main(), speed);
  }

  // pause/resume
  public togglePause() {
    this.paused = !this.paused;
  }

  // main loop
  private main() {
    if (this.paused) return;

    this.directionChanged = false;

    this.moveSnake();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawFruit();
    this.drawSnake();
    this.checkCollision();
    this.updateScore();
  }

  // move snake forward
  private moveSnake() {
    const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
    this.snake.unshift(head);

    if (head.x === this.fruit.x && head.y === this.fruit.y) {
      this.spawnFruit();
      this.score++;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('snakeHighScore', String(this.highScore));
      }
    } else {
      this.snake.pop(); // remove tail if no fruit eaten
    }
  }

  // check wall + self collision
  private checkCollision() {
    const head = this.snake[0];

    if (head.x < 0 || head.x >= this.canvas.width || head.y < 0 || head.y >= this.canvas.height) {
      this.gameOver();
    }

    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.gameOver();
      }
    }
  }

  private gameOver() {
    clearInterval(this.gameLoop);
    this.showGameOver();
  }

  // update score display
  private updateScore() {
    (document.getElementById('score') as HTMLElement).textContent = `Score: ${this.score}`;
    (
      document.getElementById('highScore') as HTMLElement
    ).textContent = `High Score: ${this.highScore}`;
  }

  // overlay handling
  private showGameOver() {
    const overlay = document.getElementById('gameOverOverlay') as HTMLElement;
    const finalScore = document.getElementById('finalScore') as HTMLElement;
    overlay.style.display = 'block';
    finalScore.textContent = `Score: ${this.score}`;
  }

  private hideGameOver() {
    const overlay = document.getElementById('gameOverOverlay') as HTMLElement;
    overlay.style.display = 'none';
  }

  // draw snake body
  private drawSnake() {
    this.snake.forEach((part, index) => {
      if (index === 0) {
        this.ctx.fillStyle = '#39ff14'; // head
        this.ctx.shadowColor = '#39ff14';
        this.ctx.shadowBlur = 12;
      } else {
        const opacity = 1 - index / this.snake.length;
        this.ctx.fillStyle = `rgba(118, 255, 122, ${opacity})`; // fading tail
        this.ctx.shadowColor = '#39ff14';
        this.ctx.shadowBlur = 6 * opacity;
      }

      this.ctx.fillRect(part.x, part.y, this.cellSize, this.cellSize);
    });

    this.ctx.shadowBlur = 0;
  }

  // draw fruit
  private drawFruit() {
    const pulse = Math.abs(Math.sin(Date.now() / 300));
    this.ctx.fillStyle = `rgba(255, 0, 0, ${0.7 + pulse * 0.3})`;
    this.ctx.shadowColor = 'red';
    this.ctx.shadowBlur = 20 + pulse * 15;
    this.ctx.fillRect(this.fruit.x, this.fruit.y, this.cellSize, this.cellSize);
    this.ctx.shadowBlur = 0;
  }

  // draw background grid
  private drawGrid() {
    this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.15)';
    for (let x = 0; x <= this.canvas.width; x += this.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y <= this.canvas.height; y += this.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  // keyboard input
  private changeDirection(event: KeyboardEvent) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
      event.preventDefault(); // stop page scrolling
    }

    if (this.directionChanged) return;

    if (event.key === 'ArrowUp' && this.dy === 0) {
      this.dx = 0;
      this.dy = -this.cellSize;
      this.directionChanged = true;
    } else if (event.key === 'ArrowDown' && this.dy === 0) {
      this.dx = 0;
      this.dy = this.cellSize;
      this.directionChanged = true;
    } else if (event.key === 'ArrowLeft' && this.dx === 0) {
      this.dx = -this.cellSize;
      this.dy = 0;
      this.directionChanged = true;
    } else if (event.key === 'ArrowRight' && this.dx === 0) {
      this.dx = this.cellSize;
      this.dy = 0;
      this.directionChanged = true;
    }
  }
}
