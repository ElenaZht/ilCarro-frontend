import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';
import {Car, Location, CarsService, Features} from '../cars.service';
import {UsersService} from '../users.service';
import {ToastrService} from 'ngx-toastr';
import {MouseEvent} from '@agm/core';



@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {
  @Output() signUpResult = new EventEmitter<boolean>();

  checkboxError: boolean;
  errorText: string;
  selectedFile: File = null;
  selectedItemsList = [];
  isNew: boolean;
  user = this.usersService.getCurrentUser();
  public currentCar: Car;
  formTitle: string;
  btnSubmitTitile: string;
  latitude = 32.0804808;
  longitude = 34.7805274;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddCarComponent>, private http: HttpClient, private carsService: CarsService, private usersService: UsersService, private toastr: ToastrService) {
    console.log('my data', data);
    if (data) {
      this.currentCar = data;
      this.formTitle = 'Edit your car';
      this.btnSubmitTitile = 'Edit';
      this.isNew = false;
      this.latitude = this.currentCar.location.lat;
      this.longitude = this.currentCar.location.lng;


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
      console.log('No car, add new car mode', this.currentCar);
    }
  }

  ngOnInit() {
  }

  onFileSelected(event: any) {
    this.selectedFile = <File> event.target.files[0];
    let reader = new FileReader();
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
    car.img_url = this.currentCar.img_url;
    car.owner_id = this.user.id;
    car.location = {...this.currentCar.location}; // should be resolved in template//
    car.location.lat = this.currentCar.location.lat;
    car.location.lng = this.currentCar.location.lng;
    car.features = this.currentCar.features;
    console.log('curr car', this.currentCar);

    if (this.isNew) {
      console.log('add car', car);
      this.carsService.addCar(car)
        .subscribe(res => {
          console.log(this.selectedItemsList);

          if (res) {
            addCarForm.reset();
            this.errorText = '';
          }
        }, err => {
          console.log(err);
          this.errorText = err.statusText;
        });
    } else {
      console.log('edit car', car);
      this.carsService.editCar(this.currentCar).subscribe(res => {
        if (res) {
          console.log('edit car res');

          this.showToastr();
          this.errorText = '';
          this.dialogRef.close(true);

        }
      }, err => {
        console.log(err);
        this.errorText = err.statusText;
      });
    }
  }

  onChosenLocation(event) {
    console.log(event);
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
  }
}
