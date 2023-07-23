import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Car, CarsService} from '../cars.service';
import {User, UsersService} from '../users.service';
import {Order, RentService, State} from '../rent.service';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Location} from '@angular/common';
import {PaymentDialogComponent} from '../payment-dialog/payment-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {LoginOrSignDialogComponent} from '../login-or-sign-dialog/login-or-sign-dialog.component';
import {Subscription} from 'rxjs';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp';
library.add(faChevronDown);
library.add(faChevronUp);

@Component({
  selector: 'app-rent-form',
  templateUrl: './rent-form.component.html',
  styleUrls: ['./rent-form.component.css']
})
export class RentFormComponent implements OnInit, OnDestroy {
  @Input() inputCarId: number;

  @Output() newRentEvent = new EventEmitter<boolean>();
  rent = true;

  city: string;
  car: Car;
  cars: any;
  id: number;
  errorText = '';
  minDate: Date;
  busyDates = [];
  user: User;

  mobile = false;
  openCard = false;

  getUserSubscription: Subscription;
  getCarSubscription: Subscription;
  getCarOrdersSubscription: Subscription;
  paymentDialogCloseSubscription: Subscription;
  addOrderSubscription: Subscription;
  loginDialogCloseSubscription: Subscription;
  constructor(private usersService: UsersService, private carsService: CarsService,
              private rentService: RentService, public dialog: MatDialog,  private location: Location, private toastr: ToastrService) {}


  ngOnInit() {
    if (window.screen.width <= 800) {
      this.mobile = true;
    } else if (window.screen.width > 800) {
      this.mobile = false;
    }
    this.getUserSubscription = this.usersService.getUser().subscribe(res => {
      this.user = res;
    });
    this.minDate = new Date();
    this.id = this.inputCarId;
    this.getCarSubscription = this.carsService.getCarById(this.id).subscribe(
      res => {
        this.car = res;
        this.city = res.location.city;
        this.getCarOrdersSubscription = this.rentService.getThisCarOrders(this.car.id).subscribe(result => {
          for (const ord of result) {
            if (ord.state === State.WaitToGo) {
              this.busyDates.push({start: new Date(`${ord.dateOn} UTC`).setHours(0, 0, 0, 0),
                end: new Date(`${ord.dateOff} UTC`).setHours(0, 0, 0, 0)});
            }
          }
        });
      }, () => {
        this.errorText = 'Car not found';
      }
    );

  }


  dateFilter(date) {
    const found = this.busyDates.find(el => el.start <=  date && date <= el.end);
    return found === undefined;
  }

  showToastr(order) {
    this.toastr.success('from ' + ' ' + order.dateOn + ' ' + 'till ' + ' ' + order.dateOff, 'You rented car' + ' ' + order.carName);
  }
  checkOverlapping(order) {
    const foundInside = this.busyDates.find(el => el.start < order.dateOn && order.dateOff <= el.end);
    const foundInsideOn = this.busyDates.find(el => el.start <  order.dateOn && order.dateOn <= el.end);
    const foundInsideOff = this.busyDates.find(el => el.start >  order.dateOn && order.dateOff <= el.end);
    const foundOutside = this.busyDates.find(el => el.start >  order.dateOn && order.dateOff >= el.end);
    return !(foundInside || foundInsideOn || foundInsideOff || foundOutside);

  }

  handleSubmit(order, rentForm) {
    if (order.dateOn.getTime() === order.dateOff.getTime()) {
      this.errorText = 'Please, choose at least 1 day of rent.';
      return;
    }
    if (order.dateOff < order.dateOn) {
      this.errorText = 'Date of return must be later than date of beginning';
      return;
    }
    order.renterId = this.user.id;
    order.renterName = this.user.first_name + ' ' + this.user.second_name;
    if (!this.checkOverlapping(order)) {
      this.errorText = 'Please, choose dates, that not includes orders of other consumers';
      return;
    }
    order.dateOn = order.dateOn.toUTCString(); // wrong date conversations
    order.dateOff = order.dateOff.toUTCString();
    const dialogRef = this.dialog.open(PaymentDialogComponent, {panelClass: 'custom-dialog-container'});
    this.paymentDialogCloseSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addOrderSubscription = this.rentService.addOrder(order).subscribe(res => {
          this.newRentEvent.emit(this.rent);
          if (res) {
            this.showToastr(order);
            rentForm.reset();
            this.errorText = '';
          } else {
            this.errorText = 'Order can not be made. Please, try later';
          }
        }, err => {
          this.errorText = err.statusText;
        });
      }
    });
  }
  onSubmit(rentForm: NgForm) {
    const order = rentForm.value as Order;
    order.dateOn = rentForm.value.dateOn;
    console.log('date from form', order.dateOn, order.dateOff);
    order.dateOff = rentForm.value.dateOff;
    order.carName = this.car.title;
    order.carId = this.car.id;
    order.carUrl = this.car.img_url;
    order.carOwnerId = this.car.owner_id;
    if (this.user && this.user.token) {
      this.handleSubmit(order, rentForm);
    } else {
      const dialogRef = this.dialog.open(LoginOrSignDialogComponent, {panelClass: 'custom-dialog-container'});
      this.loginDialogCloseSubscription = dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.handleSubmit(order, rentForm);
        }
      });
  }
  }


  ngOnDestroy(): void {
    if (this.getUserSubscription) {
      this.getUserSubscription.unsubscribe();
    }
    if (this.getCarSubscription) {
      this.getCarSubscription.unsubscribe();
    }
    if (this.getCarOrdersSubscription) {
      this.getCarOrdersSubscription.unsubscribe();
    }
    if (this.paymentDialogCloseSubscription) {
      this.paymentDialogCloseSubscription.unsubscribe();
    }
    if (this.addOrderSubscription) {
      this.addOrderSubscription.unsubscribe();
    }
    if (this.loginDialogCloseSubscription) {
      this.loginDialogCloseSubscription.unsubscribe();
    }
  }

  closeParentDialog() {

  }
}
