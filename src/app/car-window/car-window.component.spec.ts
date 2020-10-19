import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarWindowComponent } from './car-window.component';

describe('CarWindowComponent', () => {
  let component: CarWindowComponent;
  let fixture: ComponentFixture<CarWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
