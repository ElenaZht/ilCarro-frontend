import { Component, OnInit } from '@angular/core';
import {User, UsersService} from '../users.service';
import {NgForm} from '@angular/forms';
import {SingUpDialogComponent} from '../sing-up-dialog/sing-up-dialog.component';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorText: string;
  constructor(private usersService: UsersService, public dialog: MatDialog) {
    this.errorText = '';
  }

  ngOnInit() {
  }
  onSubmit(loginForm: NgForm) {
    const user = loginForm.value as User;
    console.log(' то место', user);

  }


}
