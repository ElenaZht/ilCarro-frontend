import { Component, OnInit } from '@angular/core';
import { SingUpDialogComponent } from '../sing-up-dialog/sing-up-dialog.component';
import {MatDialog} from '@angular/material';
import {Location} from '@angular/common';
import {LoginComponent} from '../login/login.component';
import {Router} from '@angular/router';
import { UsersService} from '../users.service';
import {ToastrService} from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
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

  // tslint:disable-next-line:max-line-length
  constructor(public dialog: MatDialog, private location: Location,   private router: Router, private usersService: UsersService, private toastr: ToastrService, private http: HttpClient) { }

  ngOnInit() {
  }

  logout() {
    if (confirm('Are you sure to log out?')) {
      this.usersService.logout();
      this.showToastr();
      this.router.navigate(['/loginwind']);
      this.logIn();
    }
  }
  showToastr() {
    this.toastr.success('Logged out successfully', ' ');
  }
}
