import { Component, OnInit } from '@angular/core';
import {CarsService, Car} from '../cars.service';
import {Router} from '@angular/router';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {icon, library} from '@fortawesome/fontawesome-svg-core';

library.add(faStar);
const star = icon({ prefix: 'fas', iconName: 'star' });

@Component({
  selector: 'app-popular-cars',
  templateUrl: './popular-cars.component.html',
  styleUrls: ['./popular-cars.component.css']
})
export class PopularCarsComponent implements OnInit {
  topCars = [
    {img_url: '../../assets/no_car_image2.jpg', title: 'Here can be your car', price: 0},
    {img_url: '../../assets/no_car_image2.jpg', title: 'Here can be your car', price: 0},
    {img_url: '../../assets/no_car_image2.jpg', title: 'Here can be your car', price: 0}
    ];

  constructor(private carsService: CarsService,  private router: Router) { }

  ngOnInit() {
    this.carsService.getTopCars().subscribe(res => {
      if (res && res.length) {
        let i = 0;
        while (i < res.length && i < 3) {
          this.topCars[i] = res[i];
          i++;
        }
      }
    });
  }
  onTopCar(id) {
    this.router.navigate(['/car', id]);
  }
}
