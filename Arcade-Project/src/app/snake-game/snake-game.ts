import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnakeGame } from './snake-engine';

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.html',
  styleUrls: ['./snake-game.css'],
  imports: [RouterLink],
  standalone: true,
})
export class SnakeGameComponent implements AfterViewInit {
  private game!: SnakeGame;

  @ViewChild('gameCanvas', { static: false })
  gameCanvas!: ElementRef<HTMLCanvasElement>;

  difficulty = 100; // default speed (Medium)

  ngAfterViewInit() {
    // set up the game once the canvas is ready
    this.game = new SnakeGame(this.gameCanvas.nativeElement);
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
