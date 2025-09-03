import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcadeHub } from './arcade-hub';

describe('ArcadeHub', () => {
  let component: ArcadeHub;
  let fixture: ComponentFixture<ArcadeHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArcadeHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArcadeHub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
