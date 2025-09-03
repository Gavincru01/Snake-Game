import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnakeGameComponent } from './snake-game/snake-game';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SnakeGameComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  protected readonly title = signal('Arcade-Project');
}
