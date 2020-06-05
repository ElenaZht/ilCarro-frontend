import { Component, OnInit } from '@angular/core';
import { SingUpDialogComponent } from '../sing-up-dialog/sing-up-dialog.component';
import {MatDialog} from '@angular/material';
import {Location} from '@angular/common';

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

  constructor(public dialog: MatDialog, private location: Location) { }

  ngOnInit() {
  }

}
