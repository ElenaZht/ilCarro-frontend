import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingUpDialogComponent } from './sing-up-dialog.component';

describe('SingUpDialogComponent', () => {
  let component: SingUpDialogComponent;
  let fixture: ComponentFixture<SingUpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingUpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingUpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
