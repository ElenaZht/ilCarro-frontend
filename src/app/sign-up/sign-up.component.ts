import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {User, UsersService} from '../users.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  @Output() signUpResult = new EventEmitter<boolean>();
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
        console.log(res)
        if (res) {
          signUpForm.reset();
          this.errorText = '';
          this.signUpResult.emit(true);
        }
      }, err => {
        console.log(err);
        this.errorText = err.statusText;
      });
  }
}


