import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteModalDinamicaComponent } from './reporte-modal-dinamica.component';

describe('ReporteModalDinamicaComponent', () => {
  let component: ReporteModalDinamicaComponent;
  let fixture: ComponentFixture<ReporteModalDinamicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteModalDinamicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteModalDinamicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
