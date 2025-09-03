import { Routes } from '@angular/router';
import { ArcadeHub } from './arcade-hub/arcade-hub';
import { SnakeGameComponent } from './snake-game/snake-game';

export const routes: Routes = [
  { path: '', component: ArcadeHub },
  { path: 'snake', component: SnakeGameComponent },
];
