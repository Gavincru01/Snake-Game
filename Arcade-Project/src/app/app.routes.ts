import { Routes } from '@angular/router';
import { ArcadeHub } from './arcade-hub/arcade-hub';
import { SnakeGameComponent } from './snake-game/snake-game';
import { PongGameComponent } from './pong-game/pong-game';

export const routes: Routes = [
  { path: '', component: ArcadeHub },
  { path: 'snake', component: SnakeGameComponent },
  { path: 'pong', component: PongGameComponent },
];
