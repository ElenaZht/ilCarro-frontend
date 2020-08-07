import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginOrSignDialogComponent } from './login-or-sign-dialog.component';

describe('LoginOrSignDialogComponent', () => {
  let component: LoginOrSignDialogComponent;
  let fixture: ComponentFixture<LoginOrSignDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginOrSignDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginOrSignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
