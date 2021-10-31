import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParqueoComponent } from './parqueo.component';

describe('ParqueoComponent', () => {
  let component: ParqueoComponent;
  let fixture: ComponentFixture<ParqueoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParqueoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParqueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
