import {Component, OnDestroy, OnInit} from '@angular/core';
import { SingUpDialogComponent } from '../sing-up-dialog/sing-up-dialog.component';
import {MatDialog} from '@angular/material';
import {Location} from '@angular/common';
import {LoginComponent} from '../login/login.component';
import {Router} from '@angular/router';
import { UsersService} from '../users.service';
import {ToastrService} from 'ngx-toastr';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private joinDialogSubscription;
  private loginDialogSubscription;
  constructor(public dialog: MatDialog, private location: Location,
              private router: Router, private usersService: UsersService,
              private toastr: ToastrService) { }
  joinUs() {
    const dialogRef = this.dialog.open(SingUpDialogComponent, {panelClass: 'custom-dialog-container'});
    this.joinDialogSubscription = dialogRef.afterClosed().subscribe(() => {
      this.location.back();
    });
  }
  logIn() {
    const dialogRef = this.dialog.open(LoginComponent, {panelClass: 'custom-dialog-container'});
    this.loginDialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        void this.router.navigate(['/homepage']);
      } else  {
        void this.router.navigate(['/myaccount']);

      }
    });
  }

  ngOnInit() {
  }

  logout() {
    if (confirm('Are you sure to log out?')) {
      this.usersService.logout();
      this.showToastr();
      void this.router.navigate(['/loginwind']);
      this.logIn();
    }
  }
  showToastr() {
    this.toastr.success('Logged out successfully', ' ');
  }
  ngOnDestroy(): void {
    this.joinDialogSubscription.unsubscribe();
    this.loginDialogSubscription.unsubscribe();
  }
}
