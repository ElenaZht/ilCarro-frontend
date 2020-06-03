import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { SingUpDialogComponent } from '../sing-up-dialog/sing-up-dialog.component';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  constructor(public dialog: MatDialog) { }

  ngOnInit() {

  }

  joinUs() {
    console.log('works!');

    const dialogRef = this.dialog.open(SingUpDialogComponent, {panelClass: 'custom-dialog-container'});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
