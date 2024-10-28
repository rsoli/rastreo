import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDinamicaComponent } from './modal-dinamica.component';

describe('ModalDinamicaComponent', () => {
  let component: ModalDinamicaComponent;
  let fixture: ComponentFixture<ModalDinamicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDinamicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDinamicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
