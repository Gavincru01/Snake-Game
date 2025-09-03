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

  difficulty = 5; // paddle speed or AI difficulty

  ngAfterViewInit() {
    this.game = new PongGame(this.pongCanvas.nativeElement);
  }

  startGame() {
    this.game?.startGame(this.difficulty);
  }

  resetGame() {
    this.game?.startGame(this.difficulty);
  }

  togglePause() {
    this.game?.togglePause();
  }

  setDifficulty(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.difficulty = parseInt(value, 10);
  }
}
