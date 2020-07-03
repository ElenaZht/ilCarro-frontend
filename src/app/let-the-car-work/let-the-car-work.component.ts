import { Component, OnInit } from '@angular/core';
import {SingUpDialogComponent} from '../sing-up-dialog/sing-up-dialog.component';
import {MatDialog} from '@angular/material';
import {Location} from '@angular/common';
import {LoginComponent} from '../login/login.component';
import {Router} from '@angular/router';



@Component({
  selector: 'app-let-the-car-work',
  templateUrl: './let-the-car-work.component.html',
  styleUrls: ['./let-the-car-work.component.css']
})
export class LetTheCarWorkComponent implements OnInit {
  joinUs() {
    const dialogRef = this.dialog.open(SingUpDialogComponent, {panelClass: 'custom-dialog-container'});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // this.location.back();
    });
  }
  logIn() {
    const dialogRef = this.dialog.open(LoginComponent, {panelClass: 'custom-dialog-container'});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ltw', result);
      if (result) {this.router.navigate(['/myaccount']); }
    });
  }
  constructor(public dialog: MatDialog, private location: Location,    private router: Router) { }

  ngOnInit() {
  }

}
