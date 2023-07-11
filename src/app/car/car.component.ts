import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Car, CarsService} from '../cars.service';
import {User, UsersService} from '../users.service';
import {AddCarComponent} from '../add-car/add-car.component';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCheck, faStar, faTimes} from '@fortawesome/free-solid-svg-icons';
import {MatDialog} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';

library.add(faCheck);
library.add(faTimes);
library.add(faStar);


@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
  export class CarComponent implements OnInit, OnDestroy {
  @Input() inputCarId: number;
  car: Car = {id: 0, img_url: '../../assets/no_image.jpg', title: 'no name', model: 'no model',
    price: 0, owner_id: 0, year: 0, location: {country: 'unknown', city: 'unknown', region: 'unknown',
      street: 'unknown', zip: 0, lat: 0.0, lng: 0.0}, engine: 'unknown',
      fuel: 'unknown', gear: 'unknown', fuel_cons: '0', wd: 'unknown', hp: 0, torque: 0, doors: 0,
      seats: 0, class: 'unknown', about_text: 'no text',
      features: {multimediaDisplay: false, abs: false, climatControl: false, childAutoseat: false},
      rating: 0, comments: []
  };
  id: number;
  stars = [];
  comments = [];
  user$: Observable<User>;
  private getCarSubscription;
  private getCommentSubscription;
  private closeDialogSubscription;
  private removeCarSubscription;
  constructor(private route: ActivatedRoute, private carsService: CarsService, private usersService: UsersService,
              public dialog: MatDialog,  private router: Router, private toastr: ToastrService) {}

  ngOnInit() {
    this.user$ = this.usersService.getUser();

    window.scroll(0, 0);
    if (this.inputCarId) {
      this.id = this.inputCarId;
      } else {
        this.id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
      }
    this.getCarSubscription = this.carsService.getCarById(this.id).subscribe(res => {
      this.car = res;
      this.car.features = res.features;
      this.car.location.lat = res.location.lat;
      this.car.location.lng = res.location.lng;
      for (let i = 0; i < this.car.rating; i++) {
        this.stars.push('star');
      }
      for (const comment of this.car.comments) {
        this.getCommentSubscription = this.usersService.getCommentById(comment).subscribe(
          result => {
            this.comments.push(result);
            this.comments.sort((a, b) => b.id - a.id);
          },
          err => {
            console.error(err);
          }
        );
      }
      }, error => { console.error(error); }
    );


  }

  editCar(car) {
    const carClone: Car = {...car};
    carClone.location = {...car.location};
    const dialogRef = this.dialog.open(AddCarComponent, {panelClass: 'custom-dialog-container', data: {car: carClone}});
    this.closeDialogSubscription = dialogRef.afterClosed().subscribe(() => {});
  }
  removeCar(id: number) {
    if (confirm('Delete car ' + this.car.title + '?')) {
      this.removeCarSubscription = this.carsService.removeCar(id).subscribe(() => {
        this.showToastr();
      });
      void this.router.navigate(['/myaccount']);
    }
  }
  showToastr() {
    this.toastr.success('Car deleted successfully', ' ');
  }

  ngOnDestroy(): void {
    if (this.getCarSubscription) {
      this.getCarSubscription.unsubscribe();
    }
    if (this.getCommentSubscription) {
      this.getCommentSubscription.unsubscribe();
    }
    if (this.closeDialogSubscription) {
      this.closeDialogSubscription.unsubscribe();
    }
    if (this.removeCarSubscription) {
      this.removeCarSubscription.unsubscribe();
    }
  }

}
