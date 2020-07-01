import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {SingUpDialogComponent} from '../sing-up-dialog/sing-up-dialog.component';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material';
import {LoginComponent} from '../login/login.component';



@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  logo = '../assets/img/logo.svg';
  joinUs() {
    const dialogRef = this.dialog.open(SingUpDialogComponent, {panelClass: 'custom-dialog-container'});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.location.back();
    });
  }
  logIn() {
    const dialogRef = this.dialog.open(LoginComponent, {panelClass: 'custom-dialog-container'});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (!result) {this.router.navigate(['/homepage']); }
    });
  }
  constructor(private router: Router,  private location: Location, public dialog: MatDialog) { }

  ngOnInit() {
  }

}
