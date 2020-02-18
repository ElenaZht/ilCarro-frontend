import { Component, OnInit } from '@angular/core';
import {User, UsersService} from '../users.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  checkboxError: boolean;
  errorText: string;
  constructor(private usersService: UsersService) {
    this.checkboxError = false;
    this.errorText = '';
  }
  ngOnInit() {}

  onSubmit(signUpForm: NgForm) {
    console.log(signUpForm.value.check);
    this.checkboxError = !signUpForm.value.check ;
    if (this.checkboxError) {
      return;
    }
    const user = signUpForm.value as User;
    console.log(' то место', user);
    this.usersService.AddUser(user)
      .subscribe(res => {
        if (res) {
          signUpForm.reset();
        }
      }, err => {
        this.errorText = err;
        console.log(err);
      });
  }
}


