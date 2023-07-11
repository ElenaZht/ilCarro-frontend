import {Component, OnDestroy, OnInit} from '@angular/core';
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
export class FooterComponent implements OnInit, OnDestroy {
  logo = '../assets/img/logo.svg';
  private joinDialogCloseSubscription;
  private loginDialogCloseSubscription;
  constructor(private router: Router,  private location: Location, public dialog: MatDialog) { }
  joinUs() {
    const dialogRef = this.dialog.open(SingUpDialogComponent, {panelClass: 'custom-dialog-container'});
    this.joinDialogCloseSubscription = dialogRef.afterClosed().subscribe(() => {
      this.location.back();
    });
  }
  logIn() {
    const dialogRef = this.dialog.open(LoginComponent, {panelClass: 'custom-dialog-container'});
    this.loginDialogCloseSubscription = dialogRef.afterClosed().subscribe(result => {
      if (!result) {void this.router.navigate(['/homepage']); }
    });
  }

  ngOnInit() {
  }

  up() {
    window.scrollTo(0, 0);
  }
  ngOnDestroy() {
    this.joinDialogCloseSubscription.unsubscribe();
    this.loginDialogCloseSubscription.unsubscribe();
  }
}
