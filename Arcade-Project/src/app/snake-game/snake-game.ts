import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SnakeGame } from './snake-engine';

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.html',
  styleUrls: ['./snake-game.css'],
  standalone: true,
})
export class SnakeGameComponent implements AfterViewInit {
  private game!: SnakeGame;

  @ViewChild('gameCanvas') gameCanvas!: ElementRef<HTMLCanvasElement>;

  difficulty = 100; // default Medium

  ngAfterViewInit() {
    console.log('Canvas element:', this.gameCanvas);
    this.game = new SnakeGame(this.gameCanvas.nativeElement);
  }

  startGame() {
    if (this.game) {
      this.game.startGame(this.difficulty);
    }
  }

  resetGame() {
    if (this.game) {
      this.game.startGame(this.difficulty);
    }
  }

  togglePause() {
    if (this.game) {
      this.game.togglePause();
    }
  }

  setDifficulty(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.difficulty = parseInt(value, 10);
  }
}
