import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RastreoSatelitalComponent } from './rastreo-satelital.component';

describe('RastreoSatelitalComponent', () => {
  let component: RastreoSatelitalComponent;
  let fixture: ComponentFixture<RastreoSatelitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RastreoSatelitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RastreoSatelitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
