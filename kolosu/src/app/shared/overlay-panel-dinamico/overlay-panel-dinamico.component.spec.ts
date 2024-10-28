import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayPanelDinamicoComponent } from './overlay-panel-dinamico.component';

describe('OverlayPanelDinamicoComponent', () => {
  let component: OverlayPanelDinamicoComponent;
  let fixture: ComponentFixture<OverlayPanelDinamicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayPanelDinamicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlayPanelDinamicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
