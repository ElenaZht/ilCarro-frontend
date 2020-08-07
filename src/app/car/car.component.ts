import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Car, CarsService} from '../cars.service';
import {User, UsersService} from '../users.service';
import {AddCarComponent} from '../add-car/add-car.component';
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import {faCheck, faStar, faTimes} from '@fortawesome/free-solid-svg-icons';

library.add(faCheck);
library.add(faTimes);
library.add(faStar);
const star = icon({ prefix: 'fas', iconName: 'star' });
const v = icon({ prefix: 'fas', iconName: 'check' });
const x = icon({ prefix: 'fas', iconName: 'times' });
import {MatDialog} from '@angular/material';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
  export class CarComponent implements OnInit {
  car: Car = {id: 0, img_url: '../../assets/no_image.jpg', title: 'no name', model: 'no model',  price: 0, owner_id: 0, year: 0, location: {country: 'unknown', city: 'unknown', region: 'unknown', street: 'unknown', zip: 0, lat: 0.0, lng: 0.0}, engine: 'unknown',
              fuel: 'unknown', gear: 'unknown', fuel_cons: '0', wd: 'unknown', hp: 0, torque: 0, doors: 0, seats: 0, class: 'unknown', about_text: 'no text',
              features: {multimediaDisplay: false, abs: false, climatControl: false, childAutoseat: false},
               rating: 0, comments: []};
  id: number;
  stars = [];
  comments = [];
  latitude: number;
  longitude: number;
  user: User;

  constructor(private route: ActivatedRoute, private carsService: CarsService, private userService: UsersService, public dialog: MatDialog,  private router: Router, private toastr: ToastrService) {  }
  ngOnInit() {
    if (this.userService.getCurrentUser()) {
      this.user = this.userService.getCurrentUser();
    } else {
      this.user = {} as User;
      this.user.id = -1;
    }
    window.scroll(0,0);
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.carsService.getCarById(this.id).subscribe(res => {
      console.log(res);
      this.car = res;
      this.car.features = res.features;
      this.car.location.lat = res.location.lat;
      this.car.location.lng = res.location.lng;
      console.log('this car is', this.car);
      for (let i = 0; i < this.car.rating; i++) {
        this.stars.push('star');
      }
      console.log(this.car.comments.length);
      for (let y = 0; y < this.car.comments.length; y++) {
        let comId = this.car.comments[y];
        console.log(comId);
        this.userService.getCommentById(comId).subscribe(
          res => {
            this.comments.push(res);
            this.comments.sort((a, b) => b.id - a.id);
            console.log(res);
          },
          err => {
            console.error(err);
          }
        );
      }
      }, error => { console.log(error); }
    );
    console.log(this.id);
    console.log(this.car);

  }
  editCar(car) {
    const carClone: Car = {...car};
    carClone.location = {...car.location};
    const dialogRef = this.dialog.open(AddCarComponent, {panelClass: 'custom-dialog-container', data: {...carClone}});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed edit car', result);
    });
  }
  removeCar(id: number) {
    if (confirm('Delete car ' + this.car.title + '?')) {
      this.carsService.removeCar(id).subscribe(res => {
        console.log(res);
        this.showToastr();
      });
      console.log('car ', id, 'was removed');
      this.router.navigate(['/myaccount']);
    }
  }
  showToastr() {
    this.toastr.success('Car deleted successfully', ' ');
  }



}
