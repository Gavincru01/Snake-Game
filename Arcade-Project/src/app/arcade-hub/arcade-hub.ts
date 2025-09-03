import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-arcade-hub',
  templateUrl: './arcade-hub.html',
  styleUrls: ['./arcade-hub.css'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
})
export class ArcadeHub {
  games = [
    {
      name: 'Snake',
      path: '/snake',
      icon: '🐍',
      desc: 'Classic snake with neon vibes.',
      disabled: false,
      img: 'assets/images/snake-preview.png',
    },
    {
      name: 'Coming Soon',
      path: '',
      icon: '🚀',
      desc: 'Another arcade challenge awaits!',
      disabled: true,
      img: 'assets/images/coming-soon.png',
    },
    {
      name: 'Coming Soon',
      path: '',
      icon: '🎲',
      desc: 'Stay tuned for more fun!',
      disabled: true,
      img: 'assets/images/coming-soon.png',
    },
  ];

  selectedIndex = 0;

  constructor(private router: Router) {}

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.moveSelection(1);
    } else if (event.key === 'ArrowLeft') {
      this.moveSelection(-1);
    } else if (event.key === 'Enter') {
      this.playSelected();
    }
  }

  moveSelection(step: number) {
    const max = this.games.length;
    this.selectedIndex = (this.selectedIndex + step + max) % max;
  }

  playSelected() {
    const game = this.games[this.selectedIndex];
    if (!game.disabled && game.path) {
      this.router.navigate([game.path]);
    }
  }
}
