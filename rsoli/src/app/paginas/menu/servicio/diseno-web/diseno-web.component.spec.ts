import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisenoWebComponent } from './diseno-web.component';

describe('DisenoWebComponent', () => {
  let component: DisenoWebComponent;
  let fixture: ComponentFixture<DisenoWebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisenoWebComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisenoWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
