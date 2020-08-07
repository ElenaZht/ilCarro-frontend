import {Component, OnInit} from '@angular/core';
import {Car, CarsService} from '../cars.service';
import {UsersService} from '../users.service';
import {ActivatedRoute} from '@angular/router';
import {Order, RentService, State} from '../rent.service';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Location} from '@angular/common';
import {PaymentDialogComponent} from '../payment-dialog/payment-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {LoginOrSignDialogComponent} from '../login-or-sign-dialog/login-or-sign-dialog.component';


@Component({
  selector: 'app-rent-form',
  templateUrl: './rent-form.component.html',
  styleUrls: ['./rent-form.component.css']
})
export class RentFormComponent implements OnInit {
  // public value: Date;
  city: string;
  private subscription: any;
  car: Car;
  cars: any;
  id: number;
  errorText = '';
  minDate: Date;
  minTime: number;
  bysyDates = [];

  constructor(private usersService: UsersService, private carsService: CarsService, private route: ActivatedRoute, private rentService: RentService, public dialog: MatDialog,  private location: Location, private toastr: ToastrService) {}


  ngOnInit() {
    this.minDate = new Date();
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.carsService.getCarById(this.id).subscribe(
      res => {
        console.log('rent form res: ', res);
        this.car = res;
        this.city = res.location.city;
        this.rentService.getThisCarOrders(this.car.id).subscribe(res => {
          for (let ord of res) {
            console.log('THIS CAR ORDERS:', res);
            if (ord.state === State.WaitToGo) {
              this.bysyDates.push({start: new Date(`${ord.dateOn} UTC`).setHours(0, 0, 0, 0),
                end: new Date(`${ord.dateOff} UTC`).setHours(0, 0, 0, 0)});
            }
          }
          console.log('BUSY DAYS', this.bysyDates);
        });
      }, error => {
        this.errorText = 'Car not found';
      }
    );

  }
  dateFilter(date) {
    let found = this.bysyDates.find(el => el.start <=  date && date <= el.end);
    return found === undefined;
  }

  showToastr(order) {
    this.toastr.success('from ' + ' ' + order.dateOn + ' ' + 'till ' + ' ' + order.dateOff, 'You rented car' + ' ' + order.carName);
  }
  checkOverlapping(order) {
    let foundOn = this.bysyDates.find(el => el.start <  order.dateOn && order.dateOn <= el.end);
    let foundOff = this.bysyDates.find(el => el.start <=  order.dateOf && order.dateOf <= el.end);
    console.log('found on', foundOn);
    console.log('found off', foundOff);
    return !(foundOn || foundOn);

  }

  handleSubmit(order, rentForm) {
    if (order.dateOn === order.dateOff) {
      this.errorText = 'Please, choose at least 1 day of rent.';
      return;
    }
    if (order.dateOff < order.dateOn) {
      this.errorText = 'Date of return must be later than date of beginning';
      return;
    }
    order.renterId = this.usersService.getCurrentUser().id;
    order.renterName = this.usersService.getCurrentUser().first_name + ' ' + this.usersService.getCurrentUser().second_name;
    if (!this.checkOverlapping(order)) {
      console.log('****************************** dates not valid, occupied in the middle');
      this.errorText = 'Please, choose dates, that not includes orders of other consumers';
      return;
    }
    const dialogRef = this.dialog.open(PaymentDialogComponent, {panelClass: 'custom-dialog-container'});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The payment dialog was closed', result);
      if (result) {
        this.rentService.addOrder(order).subscribe(res => {
          console.log(res);
          if (res) {
            this.showToastr(order);
            rentForm.reset();
            this.errorText = '';
          } else {
            this.errorText = 'Order can not be made. Please, try later';
          }
        }, err => {
          console.log(err);
          this.errorText = err.statusText;
        });
      }
    });
  }
  onSubmit(rentForm: NgForm) {
    let order = rentForm.value as Order;
    console.log(order);
    order.dateOn = rentForm.value.dateOn.toUTCString();
    order.dateOff = rentForm.value.dateOff.toUTCString();
    order.carName = this.car.title;
    order.carId = this.car.id;
    order.carUrl = this.car.img_url;
    order.carOwnerId = this.car.owner_id;
    if (this.usersService.getCurrentUser() && this.usersService.getCurrentUser().token) {
      this.handleSubmit(order, rentForm);
    } else {
      const dialogRef = this.dialog.open(LoginOrSignDialogComponent, {panelClass: 'custom-dialog-container'});
      dialogRef.afterClosed().subscribe(result => {
        console.log('The login/sign up dialog was closed', result);
        if (result) {
          this.handleSubmit(order, rentForm);
        }
      });
  }

}}
