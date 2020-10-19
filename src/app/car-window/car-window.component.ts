import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Car} from '../cars.service';

@Component({
  selector: 'app-car-window',
  templateUrl: './car-window.component.html',
  styleUrls: ['./car-window.component.css']
})
export class CarWindowComponent implements OnInit {
  curId: number;
  constructor(public dialogRef: MatDialogRef<CarWindowComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.curId = data;

  }

  ngOnInit() {
  }
  exit() {
    this.dialogRef.close();
  }
}
