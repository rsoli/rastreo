import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Servicios3Component } from './servicios3.component';

describe('Servicios3Component', () => {
  let component: Servicios3Component;
  let fixture: ComponentFixture<Servicios3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Servicios3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Servicios3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
