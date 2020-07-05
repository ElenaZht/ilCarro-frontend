import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Car, CarsService} from '../cars.service';
import {Comment} from '../users.service';


@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  car: Car = {id: 0, img_url: '../../assets/no_image.jpg', title: 'no name', price: 0, owner_id: 0, year: 0, location: 'unknown', engine: 'unknown',
              fuel: 'unknown', gear: 'unknown', fuel_cons: '0', wd: 'unknown', hp: 0, torque: 0, doors: 0, seats: 0, class: 'unknown', about_text: 'no text',
              features: ['no'],
               rating: 0, comments: []};
  id: number;
  features: Array<string>;

  constructor(private route: ActivatedRoute, private carsService: CarsService) {  }
  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.carsService.getCarById(this.id).subscribe(res => {
      console.log(res);
      this.car = res;
      this.features = res.features;
      }, error => { console.log(error); }
    );
    console.log(this.id);
    console.log(this.car);
  }

}
