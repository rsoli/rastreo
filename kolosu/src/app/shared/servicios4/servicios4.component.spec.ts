import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Servicios4Component } from './servicios4.component';

describe('Servicios4Component', () => {
  let component: Servicios4Component;
  let fixture: ComponentFixture<Servicios4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Servicios4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Servicios4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
