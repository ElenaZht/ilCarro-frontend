import { Component, OnInit } from '@angular/core';
import {CarsService, TopCar} from '../cars.service';

@Component({
  selector: 'app-popular-cars',
  templateUrl: './popular-cars.component.html',
  styleUrls: ['./popular-cars.component.css']
})
export class PopularCarsComponent implements OnInit {
  topCars: TopCar[];

  constructor(private carsService: CarsService) { }

  ngOnInit() {
    this.carsService.getTopCars().subscribe(res => {
      this.topCars = res;
    });
  }

}
