import {Component, OnDestroy, OnInit} from '@angular/core';
import {User, UsersService} from '../users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Car, CarsService} from '../cars.service';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faImages, faPen, faTrash} from '@fortawesome/free-solid-svg-icons';
import {AddCarComponent} from '../add-car/add-car.component';
import {MatDialog} from '@angular/material';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {Order, RentService, State} from '../rent.service';
import {ReturnDialogComponent} from '../return-dialog/return-dialog.component';
library.add(faPen);
library.add(faTrash);
library.add(faImages);


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit, OnDestroy {
  cars$: Observable<Car[]>;
  user$: Observable<User>;
  private user$subscription: Subscription;
  private user: User;
  displayName: string;
  displayEmail: string;
  carsOrders: Order[];
  myOrders: Order[];
  car: Car;
  selectedFile: File = null;
  State = State;
  notifIrder: Order;
  waitingOrders: Order[];
  canceledOrders: Order[];
  ordersStatus = {};
  errorText: string;
  myCarsOrdersSubscription: Subscription;
  myOrdersSubscription: Subscription;

  constructor(private usersService: UsersService,  private router: Router,
              private carsService: CarsService, private route: ActivatedRoute,
              public dialog: MatDialog, private toastr: ToastrService, private rentService: RentService) { }
  ngOnInit() {
    this.errorText = '';
    this.user$ = this.usersService.getUser();
    this.user$subscription = this.user$.subscribe(user => {
      if (user) {
          this.user = user;
          this.myCarsOrdersSubscription = this.rentService.getCarsOrders(user.id).subscribe(res => {
            this.carsOrders = res;
            for (const or of this.carsOrders) {
              or.dateOn = new Date(`${or.dateOn} UTC`);
              or.dateOff = new Date(`${or.dateOff} UTC`);
            }
            this.carsOrders.sort((a, b) => b.orderId - a.orderId);
            this.waitingOrders = this.carsOrders.filter(o => o.state === State.WaitToReturn);
            for (const or of this.waitingOrders) {
              this.showNotification(or);
            }
            this.canceledOrders = this.carsOrders.filter(o => o.state === State.Canceled);
            for (const orc of this.canceledOrders) {
              this.showNotification(orc);
            }
          });
          this.myOrdersSubscription = this.rentService.getMyOrders(user.id).subscribe(res => {
            this.myOrders = res;
            for (const or of this.myOrders) {
              or.dateOn = new Date(`${or.dateOn} UTC`);
              or.dateOff = new Date(`${or.dateOff} UTC`);
              const today = new Date();
              if (today >= or.dateOn) {
                this.ordersStatus[or.orderId] = true;
              }

            }
            this.myOrders.sort((a, b) => b.orderId - a.orderId);
          });
          this.displayName = user.first_name + ' ' + user.second_name;
          this.displayEmail = user.email;
          this.cars$ = this.carsService.getCarsByUserId(user.id);
          }
    });
  }
  onSelectFile(event: any) {
    this.selectedFile = event.target.files[0] as File;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (_) => {
      this.usersService.editUser(this.user.id, this.user.first_name,
        this.user.second_name, this.user.email, reader.result.toString()).subscribe(() => {
      });
    };
  }


  showNotification(order) {
    this.notifIrder = order;
    order.dateOn = new Date(`${order.dateOn} UTC`);
    order.dateOff = new Date(`${order.dateOff} UTC`);

  }
  onCloseNotifReturn(order, idx) {
    this.rentService.returnCar(order).subscribe(() => {
      this.waitingOrders.splice(idx, 1);
      this.showNotifToastr(order);

    });
  }
  onCloseNotifCancel(order, idx) {
    this.rentService.returnCar(order).subscribe(() => {
      this.canceledOrders.splice(idx, 1);
      this.showNotifToastr(order);

    });
  }
  onSupport() {
    alert('Support massege!');
  }

  toCar(id) {
    void this.router.navigate(['/car', id]);

  }

  addCar() {
    const dialogRef = this.dialog.open(AddCarComponent, {panelClass: 'custom-dialog-container', data: {user: this.user}});
    dialogRef.afterClosed().subscribe(() => {});
  }

  editCar(car) {
    const carClone: Car = {...car};
    carClone.location = {...car.location};
    const dialogRef = this.dialog.open(AddCarComponent, {panelClass: 'custom-dialog-container', data: {car: carClone, user: this.user}});
    dialogRef.afterClosed().subscribe(() => {
    });
  }
  returnCar(car) {
        const carClone: Car = {...car};
        const dialogRef = this.dialog.open(ReturnDialogComponent,
          {panelClass: 'custom-dialog-container', data: {car: carClone, user: this.user}});
        dialogRef.afterClosed().subscribe(() => {
        });
  }
  removeCar(car: Car) {
    if (confirm('Delete car ' + car.title + '?')) {
      this.carsService.removeCar(car.id)
        .subscribe(() => {
        this.showToastr();
      });
    }
  }
  showToastr() {
    this.toastr.success('Car deleted successfully', ' ');
  }
  showUserToastr() {
    this.toastr.success('User deleted successfully', ' ');
  }
  showNotifToastr(order) {
    this.toastr.success('Your car' + ' ' + order.carName + ' returned successfully', ' ');
  }
  showCancelToastr(order) {
    this.toastr.success('You canceled order on car' + ' ' + order.carName + ' successfully', ' ');
  }


  onSubmit(editUserForm: NgForm) {
    this.errorText = '';
    const user = editUserForm.value as User;
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    // handle user update

    if (editUserForm.value.userName.split(' ').length < 2) {
      this.errorText = 'User name must be full(include second name).';
      return;
    }
    user.email = editUserForm.value.userEmail;
    if (!user.email.length || !user.email.match(pattern)) {
      this.errorText = 'Email must include valid email.';
      return;
    }
    user.first_name = editUserForm.value.userName.substr(0, editUserForm.value.userName.indexOf(' '));
    user.second_name = editUserForm.value.userName.substr(editUserForm.value.userName.indexOf(' ') + 1, editUserForm.value.userName.length);

    this.usersService.editUser(this.user.id, user.first_name, user.second_name, user.email, this.user.url).subscribe(() => {});

  }



  removeUser(id: number) {
    if (confirm('Do you really want to delete your account?')) {
      this.usersService.removeUser(id).subscribe(res => {
        this.usersService.logout();
        this.showUserToastr();
      });
      void this.router.navigate(['/']);
    }
  }

  cancelOrder(order: Order) {
    order.dateOn = new Date(`${order.dateOn} UTC`).toDateString();
    order.dateOff = new Date(`${order.dateOff} UTC`).toDateString();
    if (confirm('Do your want to cancel order:' + ' ' + (order.carName)
      + ' ' + 'rented for dates' + order.dateOn + '-' + order.dateOff + '?')) {
      this.rentService.cancelOrder(order).subscribe(() => {
        this.showCancelToastr(order);
      });
    }

  }
  cancelOrderByOwner(order: Order) {
    order.dateOn = new Date(`${order.dateOn} UTC`).toDateString();
    order.dateOff = new Date(`${order.dateOff} UTC`).toDateString();
    if (confirm('Do your want to cancel order:' + ' ' + (order.carName) +
      ' ' + 'rented for dates' + order.dateOn + '-' + order.dateOff + '?')) {
      this.rentService.cancelOrderByOwner(order).subscribe(() => {
        this.canceledOrders = [];
        this.showCancelToastr(order);
      });
    }

  }
  ngOnDestroy() {
    this.user$subscription.unsubscribe();
    this.myCarsOrdersSubscription.unsubscribe();
    this.myOrdersSubscription.unsubscribe();
  }
}
