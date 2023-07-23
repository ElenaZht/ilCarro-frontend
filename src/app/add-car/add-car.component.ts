import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';
import {Car, Location, CarsService, Features} from '../cars.service';
import {User} from '../users.service';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit, OnDestroy {
  @Output() signUpResult = new EventEmitter<boolean>();

  errorText: string;
  selectedFile: File = null;
  isNew: boolean;
  user: User;
  car: Car;
  public currentCar: Car;
  private subscription;
  formTitle: string;
  btnSubmitTitile: string;
  latitude = 32.0804808;
  longitude = 34.7805274;
  validated = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private carsService: CarsService,
              public dialogRef: MatDialogRef<AddCarComponent>,  private toastr: ToastrService) {
    this.user = data.user;
    this.car = data.car;
  }

  ngOnInit() {
    if (this.car) {
      this.currentCar = this.car;
      this.formTitle = 'Edit your car';
      this.btnSubmitTitile = 'Edit';
      this.isNew = false;



    } else {
      this.currentCar = {} as Car;
      this.currentCar.location = {} as Location;
      this.currentCar.features = {} as Features;
      this.currentCar.features.childAutoseat = false;
      this.currentCar.features.abs = false;
      this.currentCar.features.climatControl = false;
      this.currentCar.features.multimediaDisplay = false;
      this.formTitle = 'Add new car';
      this.btnSubmitTitile = 'Add';
      this.isNew = true;
      this.currentCar.location.lat = this.latitude;
      this.currentCar.location.lng = this.longitude;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (_) => {
      this.currentCar.img_url = reader.result.toString();
    };
  }
  showToastr() {
    this.toastr.success('Car edited successfully', ' ');
  }

  onSubmit(addCarForm: NgForm) {
    const car = addCarForm.value as Car;
    if (!car || !car.model || !car.price || !car.year) {
      this.validated = false;
      document.getElementById('inp2').classList.add('halo');
      document.getElementById('inp3').classList.add('halo');
      document.getElementById('inp14').classList.add('halo');
      console.log('validating fail', car.model, car.price, car.year);
      return;
    } else {this.validated = true;}
    car.img_url = this.currentCar.img_url;
    car.owner_id = this.user.id;
    car.location = {...this.currentCar.location}; // should be resolved in template//todo ?
    car.location.lat = this.currentCar.location.lat;
    car.location.lng = this.currentCar.location.lng;
    car.features = this.currentCar.features;
    if (!car.title) {car.title = 'Private car'; }
    if (!car.location.city) {car.location.city = 'Tel Aviv'; }


    if (this.isNew) {
      this.subscription = this.carsService.addCar(car)
        .subscribe(res => {

          if (res) {
            this.dialogRef.close();
            addCarForm.reset();
            this.errorText = '';

          }
        }, err => {
          this.errorText = err.statusText;
        });
    } else {
      this.subscription = this.carsService.editCar(this.currentCar).subscribe(res => {
        if (res) {

          this.showToastr();
          this.errorText = '';
          this.dialogRef.close(true);

        }
      }, err => {
        this.errorText = err.statusText;
      });
    }
  }

  onChosenLocation(event) {
    this.currentCar.location.lat = event.coords.lat;
    this.currentCar.location.lng = event.coords.lng;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
