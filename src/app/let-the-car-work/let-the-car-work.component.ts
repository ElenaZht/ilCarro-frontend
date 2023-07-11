import {Component, OnDestroy, OnInit} from '@angular/core';
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
export class LetTheCarWorkComponent implements OnInit, OnDestroy {
  private joinDialogCloseSubscription;
  private loginDialogCloseSubscription;
  constructor(public dialog: MatDialog,  private router: Router) { }
  joinUs() {
    const dialogRef = this.dialog.open(SingUpDialogComponent, {panelClass: 'custom-dialog-container'});
    this.joinDialogCloseSubscription = dialogRef.afterClosed().subscribe(() => {});
  }
  logIn() {
    const dialogRef = this.dialog.open(LoginComponent, {panelClass: 'custom-dialog-container'});
    this.loginDialogCloseSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {void this.router.navigate(['/myaccount']); }
    });
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    if (this.joinDialogCloseSubscription) {
      this.joinDialogCloseSubscription.unsubscribe();
    }
    if (this.loginDialogCloseSubscription) {
      this.loginDialogCloseSubscription.unsubscribe();
    }

  }

}
