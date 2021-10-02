import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesarrolloSoftwareComponent } from './desarrollo-software.component';

describe('DesarrolloSoftwareComponent', () => {
  let component: DesarrolloSoftwareComponent;
  let fixture: ComponentFixture<DesarrolloSoftwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesarrolloSoftwareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesarrolloSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
