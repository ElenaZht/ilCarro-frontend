import { Injectable} from '@angular/core';
import {Car, CarsService} from './cars.service';
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

  getTopCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${environment.apiUrl}/cars/topcars`);
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${environment.apiUrl}/car/${id}`);
  }

  getCarByUserId(id: number): Observable<Car[]> {
    return this.http.get<Car[]>(`${environment.apiUrl}/cars/user/${id}`);
  }
  addCar(car: Car): Observable<boolean> {
    console.log(car);
    console.log(environment.apiUrl);
    return this.http.post<boolean>(`${environment.apiUrl}/cars/addcar`, car);

  }
  editCar(car: Car): Observable<boolean> {
    console.log(car);
    console.log(environment.apiUrl);
    return this.http.put<boolean>(`${environment.apiUrl}/cars/editcar`, car);

  }

  removeCar(id: number): Observable<boolean> {
    console.log('remove car: ', id);
    return this.http.delete<boolean>(`${environment.apiUrl}/cars/removecar/${id}`);
  }
}
