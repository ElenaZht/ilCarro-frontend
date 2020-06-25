import { Component, OnInit } from '@angular/core';
import {User, UsersService} from '../users.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorText: string;
  constructor(public dialogRef: MatDialogRef<LoginComponent>, private usersService: UsersService,  private router: Router) {
    this.errorText = '';
  }

  ngOnInit() {
  }
  onSubmit(loginForm: NgForm) {
    const user = loginForm.value as User;
    console.log(' то место', user);
    this.usersService.logIn(user.email, user.password)
      .subscribe(answer => {
        if (answer && answer.first_name) {
          console.log('user recieved', user);
          loginForm.reset();
          this.router.navigate(['/homepage']);
          this.dialogRef.close(true);
        }
      }, err => {
        console.log(err);
        this.errorText = err.statusText;
      }
  );
  }


  exit() {
    this.dialogRef.close();
  }
}
