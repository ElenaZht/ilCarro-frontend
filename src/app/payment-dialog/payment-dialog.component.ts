import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';


@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PaymentDialogComponent>,  private router: Router) { }

  ngOnInit() {
  }
  onPay() {
    this.dialogRef.close(true);
    void this.router.navigate(['/myaccount']);

  }
}
