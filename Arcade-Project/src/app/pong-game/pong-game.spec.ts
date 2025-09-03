import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongGame } from './pong-game';

describe('PongGame', () => {
  let component: PongGame;
  let fixture: ComponentFixture<PongGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PongGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PongGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
