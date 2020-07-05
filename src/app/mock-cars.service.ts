import { Injectable} from '@angular/core';
import {Car, CarsService, TopCar} from './cars.service';
import {Observable, of} from 'rxjs';
import {Comment, User} from './users.service';
import {environment} from './environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MockCarsService implements CarsService {
  currentCar: Car;
  constructor(private http: HttpClient) { }

  getTopCars(): Observable<TopCar[]> {
    const cars = [{ url: '../../assets/zaz.jpg', title: 'zaz', price: 230},
      { url: '../../assets/gaz.jpg', title: 'gaz', price: 300},
      { url: '../../assets/azlk.jpg', title: 'azlk', price: 180}];
    return of(cars);
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${environment.apiUrl}/car/${id}`);
  }

  getCarByUserId(id: number): Observable<Car[]> {
    return this.http.get<Car[]>(`${environment.apiUrl}/cars/user/${id}`);
  }
}
