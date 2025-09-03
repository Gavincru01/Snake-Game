export class PongGame {
  private ctx: CanvasRenderingContext2D;
  private gameLoop: any;
  private paused = false;

  // ball
  private ball = { x: 400, y: 300, dx: 4, dy: 4, size: 12 };

  // paddles
  private paddleHeight = 100;
  private paddleWidth = 15;
  private playerY = 250;
  private aiY = 250;
  private paddleSpeed = 6;

  // scores
  private playerScore = 0;
  private aiScore = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // controls
    document.addEventListener('keydown', this.handleKey.bind(this));
  }

  // start game
  public startGame(difficulty: number = 5) {
    this.playerScore = 0;
    this.aiScore = 0;
    this.resetBall();
    this.hideGameOver();

    // adjust AI difficulty
    this.paddleSpeed = difficulty;

    if (this.gameLoop) clearInterval(this.gameLoop);
    this.gameLoop = setInterval(() => this.main(), 1000 / 60); // 60 FPS
  }

  // pause / unpause
  public togglePause() {
    this.paused = !this.paused;
  }

  private main() {
    if (this.paused) return;

    this.moveBall();
    this.moveAI();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawCourt();
    this.drawPaddles();
    this.drawBall();
    this.drawScore();
  }

  // move ball and check collisions
  private moveBall() {
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // top/bottom bounce
    if (this.ball.y <= 0 || this.ball.y + this.ball.size >= this.canvas.height) {
      this.ball.dy *= -1;
    }

    // player paddle collision
    if (
      this.ball.x <= this.paddleWidth &&
      this.ball.y + this.ball.size >= this.playerY &&
      this.ball.y <= this.playerY + this.paddleHeight
    ) {
      this.ball.dx *= -1;
      this.ball.x = this.paddleWidth; // avoid sticking
    }

    // AI paddle collision
    if (
      this.ball.x + this.ball.size >= this.canvas.width - this.paddleWidth &&
      this.ball.y + this.ball.size >= this.aiY &&
      this.ball.y <= this.aiY + this.paddleHeight
    ) {
      this.ball.dx *= -1;
      this.ball.x = this.canvas.width - this.paddleWidth - this.ball.size;
    }

    // score check
    if (this.ball.x < 0) {
      this.aiScore++;
      this.resetBall();
    } else if (this.ball.x > this.canvas.width) {
      this.playerScore++;
      this.resetBall();
    }
  }

  // AI paddle follows ball
  private moveAI() {
    const aiCenter = this.aiY + this.paddleHeight / 2;
    if (aiCenter < this.ball.y) this.aiY += this.paddleSpeed;
    else if (aiCenter > this.ball.y) this.aiY -= this.paddleSpeed;

    // clamp
    this.aiY = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.aiY));
  }

  // player paddle movement
  private handleKey(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.playerY -= 20;
    } else if (event.key === 'ArrowDown') {
      this.playerY += 20;
    } else if (event.key === ' ') {
      this.togglePause();
    }

    // clamp
    this.playerY = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.playerY));
  }

  // reset ball to center
  private resetBall() {
    this.ball.x = this.canvas.width / 2 - this.ball.size / 2;
    this.ball.y = this.canvas.height / 2 - this.ball.size / 2;
    this.ball.dx = Math.random() > 0.5 ? 4 : -4;
    this.ball.dy = Math.random() > 0.5 ? 4 : -4;
  }

  // draw court background
  private drawCourt() {
    this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
    this.ctx.setLineDash([10, 15]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  // draw paddles
  private drawPaddles() {
    this.ctx.fillStyle = '#39ff14'; // player paddle = green
    this.ctx.fillRect(0, this.playerY, this.paddleWidth, this.paddleHeight);

    this.ctx.fillStyle = '#ff00ff'; // AI paddle = pink
    this.ctx.fillRect(
      this.canvas.width - this.paddleWidth,
      this.aiY,
      this.paddleWidth,
      this.paddleHeight
    );
  }

  // draw ball
  private drawBall() {
    this.ctx.fillStyle = '#00e5ff'; // cyan ball
    this.ctx.beginPath();
    this.ctx.arc(
      this.ball.x + this.ball.size / 2,
      this.ball.y + this.ball.size / 2,
      this.ball.size / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  // draw scores
  private drawScore() {
    (
      document.getElementById('playerScore') as HTMLElement
    ).textContent = `Player: ${this.playerScore}`;
    (document.getElementById('aiScore') as HTMLElement).textContent = `AI: ${this.aiScore}`;
  }

  // overlay handling
  private showGameOver() {
    const overlay = document.getElementById('gameOverOverlay') as HTMLElement;
    overlay.style.display = 'block';
  }

  private hideGameOver() {
    const overlay = document.getElementById('gameOverOverlay') as HTMLElement;
    overlay.style.display = 'none';
  }
}
