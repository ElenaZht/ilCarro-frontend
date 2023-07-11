import {Component, OnDestroy, OnInit} from '@angular/core';
import {User, UsersService} from '../users.service';
import {NgForm} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  errorText = '';
  private loginSubscription;
  constructor(public dialogRef: MatDialogRef<LoginComponent>, private usersService: UsersService) {
  }

  ngOnInit() {
  }
  onSubmit(loginForm: NgForm) {
    const user = loginForm.value as User;
    this.loginSubscription = this.usersService.logIn(user.email, user.password)
      .subscribe(answer => {
        if (answer) {
          loginForm.reset();
          this.dialogRef.close(true);
        } else {
          this.errorText = 'Wrong login or password.';
        }
      }, err => {
        this.errorText = err;
      }
  );
  }


  exit() {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }

  }
}
