import {Observable} from 'rxjs';
import {User} from './users.service';

export interface TopCar {
  url: string;
  title: string;
  price: number;
}
export interface Car {
  id: number;
  img_url: string;
  title: string;
  price: number;
  owner_id: number;
  year: number;
  location: string;
  engine: string;
  fuel: string;
  gear: string;
  fuel_cons: string;
  wd: string;
  hp: number;
  torque: number;
  doors: number;
  seats: number;
  class: string;
  about_text: string;
  features: Array<string>;
  rating: number;
  comments: Array<number>;
}
export abstract class CarsService {
  constructor() { }
  abstract getTopCars(): Observable<TopCar[]>;
  abstract getCarById(id: number): Observable<Car>;
  abstract getCarByUserId(id: number): Observable<Car[]>;

}
