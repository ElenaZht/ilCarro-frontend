import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-sing-up-dialog',
  templateUrl: './sing-up-dialog.component.html',
  styleUrls: ['./sing-up-dialog.component.css']
})
export class SingUpDialogComponent {

  constructor(public dialogRef: MatDialogRef<SingUpDialogComponent>) {}

  closeDialog(event): void {
    this.dialogRef.close(event);
  }

}
