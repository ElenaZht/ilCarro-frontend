import { Injectable} from '@angular/core';
import {Car, CarsService} from './cars.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from './environments/environment';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MockCarsService implements CarsService {
  myCars$: BehaviorSubject<Car[]> = new BehaviorSubject([]);
  constructor(private http: HttpClient) {}

  getTopCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${environment.apiUrl}/cars/topcars`);
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${environment.apiUrl}/car/${id}`);
  }

  getCarsByUserId(id: number): Observable<Car[]> {
    this.http.get<Car[]>(`${environment.apiUrl}/cars/user/${id}`).subscribe(res => {
      this.myCars$.next(res);
    });
    return this.myCars$.asObservable();
  }
  addCar(car: Car): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/cars/addcar`, car).pipe(map(
      res => {
        if (res) {
          this.myCars$.next(this.myCars$.getValue().concat([car]));
        }
        return res;
      }
    ));

  }
  editCar(car: Car): Observable<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/cars/editcar`, car).pipe(map(
      res => {
        if (res) {
          const cars = this.myCars$.getValue();
          const idx = cars.findIndex(c => c.id === car.id);
          if (idx >= 0) {
            cars[idx] = car;
            this.myCars$.next(cars);
          }
        }
        return res;
      }
    ));

  }

  removeCar(id: number): Observable<boolean> {
    console.log('hi1');
    return this.http.delete<boolean>(`${environment.apiUrl}/cars/removecar/${id}`).pipe(map(
      res => {
        console.log('hi2')
        if (res) {
            this.myCars$.next(this.myCars$.getValue().filter(c => c.id !== id));
        }
        return res;
      }
    ));
  }
}
