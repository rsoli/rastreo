import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePagoComponent } from './cliente-pago.component';

describe('ClientePagoComponent', () => {
  let component: ClientePagoComponent;
  let fixture: ComponentFixture<ClientePagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientePagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
