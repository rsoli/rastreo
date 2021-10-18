import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoVehiculoComponent } from './monitoreo-vehiculo.component';

describe('MonitoreoVehiculoComponent', () => {
  let component: MonitoreoVehiculoComponent;
  let fixture: ComponentFixture<MonitoreoVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoreoVehiculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
