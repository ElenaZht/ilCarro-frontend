import {Component, Input, OnInit} from '@angular/core';
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
import {Observable} from 'rxjs';


@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
  export class CarComponent implements OnInit {
  @Input() inputCarId: number;
  car: Car = {id: 0, img_url: '../../assets/no_image.jpg', title: 'no name', model: 'no model',  price: 0, owner_id: 0, year: 0, location: {country: 'unknown', city: 'unknown', region: 'unknown', street: 'unknown', zip: 0, lat: 0.0, lng: 0.0}, engine: 'unknown',
              fuel: 'unknown', gear: 'unknown', fuel_cons: '0', wd: 'unknown', hp: 0, torque: 0, doors: 0, seats: 0, class: 'unknown', about_text: 'no text',
              features: {multimediaDisplay: false, abs: false, climatControl: false, childAutoseat: false},
               rating: 0, comments: []};
  id: number;
  stars = [];
  comments = [];
  latitude: number;
  longitude: number;
  user$: Observable<User>;

  constructor(private route: ActivatedRoute, private carsService: CarsService, private usersService: UsersService, public dialog: MatDialog,  private router: Router, private toastr: ToastrService) {  }

  ngOnInit() {
    this.user$ = this.usersService.getUser();

    window.scroll(0,0);
    console.log('this input car', this.inputCarId);
    if (this.inputCarId) {
      this.id = this.inputCarId;
      } else {
        this.id = parseInt(this.route.snapshot.paramMap.get('id'));
      }
    this.carsService.getCarById(this.id).subscribe(res => {
      this.car = res;
      this.car.features = res.features;
      this.car.location.lat = res.location.lat;
      this.car.location.lng = res.location.lng;
      for (let i = 0; i < this.car.rating; i++) {
        this.stars.push('star');
      }
      for (let y = 0; y < this.car.comments.length; y++) {
        let comId = this.car.comments[y];
        this.usersService.getCommentById(comId).subscribe(
          res => {
            this.comments.push(res);
            this.comments.sort((a, b) => b.id - a.id);
          },
          err => {
            console.error(err);
          }
        );
      }
      }, error => { console.log(error); }
    );


  }

  editCar(car) {
    const carClone: Car = {...car};
    carClone.location = {...car.location};
    const dialogRef = this.dialog.open(AddCarComponent, {panelClass: 'custom-dialog-container', data: {car: carClone}});
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
