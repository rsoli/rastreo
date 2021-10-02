import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteligenciaNegocioComponent } from './inteligencia-negocio.component';

describe('InteligenciaNegocioComponent', () => {
  let component: InteligenciaNegocioComponent;
  let fixture: ComponentFixture<InteligenciaNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteligenciaNegocioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteligenciaNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
