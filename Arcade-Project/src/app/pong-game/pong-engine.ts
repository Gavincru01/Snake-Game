export class PongGame {
  private ctx: CanvasRenderingContext2D;
  private gameLoop: any;

  private paddleWidth = 15;
  private paddleHeight = 100;
  private ballSize = 15;

  private winningScore = 5;
  private playerScore = 0;
  private aiScore = 0;

  private playerY = 0;
  private aiY = 0;
  private ballX = 0;
  private ballY = 0;
  private ballDX = 4;
  private ballDY = 4;

  private paddleSpeed = 5;
  private paused = false;

  private keys: { [key: string]: boolean } = {};

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    document.addEventListener('keydown', (e) => (this.keys[e.key] = true));
    document.addEventListener('keyup', (e) => (this.keys[e.key] = false));
  }

  /** Start the game with difficulty (paddle speed) */
  public startGame(winningScore: number = 5) {
    this.reset();
    this.winningScore = winningScore; // 👈 set here
    if (this.gameLoop) clearInterval(this.gameLoop);

    (document.getElementById('gameOverOverlay') as HTMLElement).style.display = 'none';

    this.gameLoop = setInterval(() => this.loop(), 1000 / 60);
  }

  public togglePause() {
    this.paused = !this.paused;
  }

  private reset() {
    this.playerScore = 0;
    this.aiScore = 0;

    this.playerY = this.canvas.height / 2 - this.paddleHeight / 2;
    this.aiY = this.playerY;

    this.resetBall(Math.random() > 0.5 ? 1 : -1);
    this.updateScore();
  }

  private loop() {
    if (this.paused) return;

    // Smooth paddle control
    if (this.keys['ArrowUp'] && this.playerY > 0) {
      this.playerY -= this.paddleSpeed;
    }
    if (this.keys['ArrowDown'] && this.playerY + this.paddleHeight < this.canvas.height) {
      this.playerY += this.paddleSpeed;
    }

    this.moveBall();
    this.moveAI();
    this.draw();
  }

  private moveBall() {
    this.ballX += this.ballDX;
    this.ballY += this.ballDY;

    // Bounce off top/bottom
    if (this.ballY <= 0 || this.ballY + this.ballSize >= this.canvas.height) {
      this.ballDY *= -1;
    }

    // Player paddle collision
    if (
      this.ballX <= this.paddleWidth &&
      this.ballY + this.ballSize >= this.playerY &&
      this.ballY <= this.playerY + this.paddleHeight
    ) {
      this.ballDX *= -1;
    }

    // AI paddle collision
    if (
      this.ballX + this.ballSize >= this.canvas.width - this.paddleWidth &&
      this.ballY + this.ballSize >= this.aiY &&
      this.ballY <= this.aiY + this.paddleHeight
    ) {
      this.ballDX *= -1;
    }

    // Player scores if ball passes AI
    if (this.ballX > this.canvas.width) {
      this.playerScore++;
      this.updateScore();
      if (this.playerScore >= this.winningScore) {
        this.endGame('Player Wins!');
      } else {
        this.resetBall(-1);
      }
    }

    // AI scores if ball passes Player
    if (this.ballX < 0) {
      this.aiScore++;
      this.updateScore();
      if (this.aiScore >= this.winningScore) {
        this.endGame('AI Wins!');
      } else {
        this.resetBall(1);
      }
    }
  }

  private resetBall(direction: number) {
    this.ballX = this.canvas.width / 2 - this.ballSize / 2;
    this.ballY = this.canvas.height / 2 - this.ballSize / 2;
    this.ballDX = 4 * direction;
    this.ballDY = 4 * (Math.random() > 0.5 ? 1 : -1);
  }

  private moveAI() {
    const aiCenter = this.aiY + this.paddleHeight / 2;
    if (aiCenter < this.ballY) this.aiY += this.paddleSpeed - 2;
    else this.aiY -= this.paddleSpeed - 2;
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Player paddle
    this.ctx.fillStyle = '#39ff14';
    this.ctx.fillRect(0, this.playerY, this.paddleWidth, this.paddleHeight);

    // AI paddle
    this.ctx.fillStyle = '#ff00ff';
    this.ctx.fillRect(
      this.canvas.width - this.paddleWidth,
      this.aiY,
      this.paddleWidth,
      this.paddleHeight
    );

    // Ball
    this.ctx.fillStyle = '#00e5ff';
    this.ctx.fillRect(this.ballX, this.ballY, this.ballSize, this.ballSize);

    // Divider
    this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    for (let y = 0; y < this.canvas.height; y += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.canvas.width / 2, y);
      this.ctx.lineTo(this.canvas.width / 2, y + 15);
      this.ctx.stroke();
    }

    this.updateScore();
  }

  private updateScore() {
    (
      document.getElementById('playerScore') as HTMLElement
    ).textContent = `Player: ${this.playerScore}`;
    (document.getElementById('aiScore') as HTMLElement).textContent = `AI: ${this.aiScore}`;
  }

  private endGame(message: string) {
    clearInterval(this.gameLoop);

    const overlay = document.getElementById('gameOverOverlay') as HTMLElement;
    overlay.style.display = 'block';

    // Set message and score
    overlay.querySelector('h2')!.textContent = message;
    const finalScore = overlay.querySelector('#finalScore') as HTMLElement;
    if (finalScore) {
      finalScore.textContent = `Player ${this.playerScore} - ${this.aiScore} AI`;
    }
  }
}
