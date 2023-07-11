import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { SingUpDialogComponent } from '../sing-up-dialog/sing-up-dialog.component';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  private dialogCloseSubscription;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {

  }

  joinUs() {
    const dialogRef = this.dialog.open(SingUpDialogComponent, {panelClass: 'custom-dialog-container'});
    this.dialogCloseSubscription = dialogRef.afterClosed().subscribe(() => {});
  }
  ngOnDestroy(): void {
    if (this.dialogCloseSubscription) {
      this.dialogCloseSubscription.unsubscribe();
    }
  }
}
