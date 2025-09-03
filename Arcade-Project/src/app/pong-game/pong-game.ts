import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PongGame } from './pong-engine';

@Component({
  selector: 'app-pong-game',
  templateUrl: './pong-game.html',
  styleUrls: ['./pong-game.css'],
  imports: [RouterLink],
  standalone: true,
})
export class PongGameComponent implements AfterViewInit {
  private game!: PongGame;

  @ViewChild('pongCanvas', { static: false })
  pongCanvas!: ElementRef<HTMLCanvasElement>;

  winningScore = 5; // default win condition

  ngAfterViewInit() {
    if (this.pongCanvas?.nativeElement) {
      this.game = new PongGame(this.pongCanvas.nativeElement);
    }
  }

  setWinningScore(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.winningScore = parseInt(value, 10);
  }

  startGame() {
    if (this.game) {
      this.game.startGame(this.winningScore);
    }
  }

  resetGame() {
    if (this.game) {
      this.game.startGame(this.winningScore);
    }
  }

  togglePause() {
    if (this.game) {
      this.game.togglePause();
    }
  }

  closeOverlay() {
    const overlay = document.getElementById('gameOverOverlay') as HTMLElement;
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
}
