import {Component, OnDestroy, OnInit} from '@angular/core';
import {User, UsersService} from '../users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Car, CarsService} from '../cars.service';
import {icon, library} from '@fortawesome/fontawesome-svg-core';
import {faImages, faPen, faTrash} from '@fortawesome/free-solid-svg-icons';
import {AddCarComponent} from '../add-car/add-car.component';
import {MatDialog} from '@angular/material';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {Order, RentService, State} from '../rent.service';
import {ReturnDialogComponent} from '../return-dialog/return-dialog.component';


library.add(faPen);
library.add(faTrash);
library.add(faImages);

const pen = icon({ prefix: 'fas', iconName: 'pen' });
const trash = icon({ prefix: 'fas', iconName: 'trash' });
const images = icon({ prefix: 'fas', iconName: 'images' });



@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit, OnDestroy {
  cars: Array<Car>;
  user$: Observable<User>;
  private subscription: any;
  private id: number;
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


  constructor(private usersService: UsersService,  private router: Router, private carsService: CarsService, private route: ActivatedRoute, public dialog: MatDialog, private toastr: ToastrService, private rentService: RentService) { }
  ngOnInit() {
    this.errorText = '';
    this.user$ = this.usersService.getUser();
    this.subscription = this.user$.subscribe(user => {
      console.log('got user info');
      this.id = user.id;
      this.rentService.getCarsOrders(user.id).subscribe(res => {
        this.carsOrders = res;
        for (const or of this.carsOrders) {
          or.dateOn = new Date(`${or.dateOn} UTC`);
          or.dateOff = new Date(`${or.dateOff} UTC`);
        }
        this.carsOrders.sort((a, b) => b.orderId - a.orderId);
        console.log(this.carsOrders);
        this.waitingOrders = this.carsOrders.filter(o => o.state === State.WaitToReturn);
        console.log('waiting orders : ', this.waitingOrders);
        for (let or of this.waitingOrders) {
          this.showNotification(or);
        }
        this.canceledOrders = this.carsOrders.filter(o => o.state === State.Canceled);
        console.log('canceled orders : ', this.waitingOrders);
        for (let orc of this.canceledOrders) {
          this.showNotification(orc);
        }
      });
      this.rentService.getMyOrders(user.id).subscribe(res => {
        this.myOrders = res;

        for (const or of this.myOrders) {
          or.dateOn = new Date(`${or.dateOn} UTC`);
          or.dateOff = new Date(`${or.dateOff} UTC`);
          let today = new Date();
          if (today >= or.dateOn) {
            this.ordersStatus[or.orderId] = true;
            // or.orderDateCome = true;
            console.log('ORDER DATE COME', or.dateOn, 'today', today);
            console.log('ORDER DATE COME', typeof (or.dateOn), 'today', typeof (today));
          }

        }
        this.myOrders.sort((a, b) => b.orderId - a.orderId);
        console.log(this.myOrders);
      });
      this.displayName = user.first_name + ' ' +  user.second_name;
      this.displayEmail = user.email;
      this.carsService.getCarByUserId(user.id).subscribe(res => {
        this.cars = res;
      }, error => console.log(error));
    });
  }
  onSelectFile(event: any) {
    this.selectedFile = <File> event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (_) => {
      const currUser = this.usersService.getCurrentUser();
      currUser.url = reader.result.toString();
      this.usersService.editUser(currUser.id, currUser.first_name, currUser.second_name, currUser.email, currUser.url).subscribe(res => {
        console.log(res);
      });
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  showNotification(order) {
    console.log('SHOW NOTIF FOR ORDER:', order);
    this.notifIrder = order;
    order.dateOn = new Date(`${order.dateOn} UTC`);
    order.dateOff = new Date(`${order.dateOff} UTC`);

  }
  onCloseNotifReturn(order, idx) {
    console.log('CLOSE NOTIF');
    this.rentService.returnCar(order).subscribe(res => {
      console.log('status of car return', res);
      this.waitingOrders.splice(idx, 1);
      this.showNotifToastr(order);

    });
  }
  onCloseNotifCancel(order, idx) {
    console.log('CLOSE NOTIF');
    this.rentService.returnCar(order).subscribe(res => {
      console.log('status of car return', res);
      this.canceledOrders.splice(idx, 1);
      this.showNotifToastr(order);

    });
  }
  onSupport() {
    alert('Support massege!');
  }

  toCar(id) {
    this.router.navigate(['/car', id]);

  }

  addCar() {
    const dialogRef = this.dialog.open(AddCarComponent, {panelClass: 'custom-dialog-container'});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed add car', result);
    });
  }

  editCar(car) {
    const carClone: Car = {...car};
    carClone.location = {...car.location};
    const dialogRef = this.dialog.open(AddCarComponent, {panelClass: 'custom-dialog-container', data: {...carClone}});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed edit car', result);
    });
  }
  returnCar(car) {
        const carClone: Car = {...car};
        console.log('return for car: ', car);
        // carClone.location = {...car.location};
        const dialogRef = this.dialog.open(ReturnDialogComponent, {panelClass: 'custom-dialog-container', data: {...carClone}});
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed edit car', result);
        });
  }
  removeCar(car: Car) {
    if (confirm('Delete car ' + car.title + '?')) {
      this.carsService.removeCar(car.id).subscribe(res => {
        console.log(res);
        this.showToastr();
      });
      console.log('car ', car.id, 'was removed');
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

  refresh() {
    this.carsService.getCarByUserId(this.id).subscribe(res => {
      this.cars = res;
      console.log(res);
    }, error => console.log(error));
  }

  onSubmit(editUserForm: NgForm) {
    this.errorText = '';
    const user = editUserForm.value as User;
    console.log(user);
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
    let currentUser = this.usersService.getCurrentUser();
    console.log('name:' , user.first_name);
    console.log('second:' , user.second_name);
    console.log('email:' , user.email);
    this.usersService.editUser(currentUser.id, user.first_name, user.second_name, user.email, user.url).subscribe(
            res => {
              console.log(res);
            });

  }



  test() {
    this.usersService.test();
  }


  removeUser(id: number) {
    if (confirm('Do you really want to delete your account?')) {
      this.usersService.removeUser(id).subscribe(res => {
        console.log(res);
        this.usersService.logout();
        this.showUserToastr();
      });
      console.log('user ', id, 'was removed');
      this.router.navigate(['/']);
    }
  }

  cancelOrder(order: Order) {
    order.dateOn = new Date(`${order.dateOn} UTC`).toDateString();
    order.dateOff = new Date(`${order.dateOff} UTC`).toDateString();
    if (confirm('Do your want to cancel order:' + ' ' + (order.carName) + ' ' + 'rented for dates' + order.dateOn + '-' + order.dateOff + '?')) {
      this.rentService.cancelOrder(order).subscribe(res => {
        this.showCancelToastr(order);
      });
    }

  }
  cancelOrderByOwner(order: Order) {
    order.dateOn = new Date(`${order.dateOn} UTC`).toDateString();
    order.dateOff = new Date(`${order.dateOff} UTC`).toDateString();
    if (confirm('Do your want to cancel order:' + ' ' + (order.carName) + ' ' + 'rented for dates' + order.dateOn + '-' + order.dateOff + '?')) {
      this.rentService.cancelOrderByOwner(order).subscribe(res => {
        this.canceledOrders = [];
        this.showCancelToastr(order);
      });
    }

  }

}
