import { Injectable} from '@angular/core';
import {CarsService, TopCar} from './cars.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockCarsService implements CarsService {
  constructor() { }

  getTopCars(): Observable<TopCar[]> {
    const cars = [{ url: '../../assets/zaz.jpg', title: 'zaz', price: 230},
      { url: '../../assets/gaz.jpg', title: 'gaz', price: 300},
      { url: '../../assets/azlk.jpg', title: 'azlk', price: 180}];
    return of(cars);
  }
}
