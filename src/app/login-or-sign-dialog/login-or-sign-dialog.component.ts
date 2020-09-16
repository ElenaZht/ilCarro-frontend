import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-login-or-sign-dialog',
  templateUrl: './login-or-sign-dialog.component.html',
  styleUrls: ['./login-or-sign-dialog.component.css']
})
export class LoginOrSignDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LoginOrSignDialogComponent>) { }

  ngOnInit() {}
  exit() {
    this.dialogRef.close();
  }
}
