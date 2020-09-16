import {Observable} from 'rxjs';

// export interface TopCar {
//   url: string;
//   title: string;
//   price: number;
// }
export interface Location {
  country: string;
  city: string;
  street: string;
  region: string;
  zip: number;
  lat: number;
  lng: number;
}
export interface Features {
  multimediaDisplay: boolean;
  abs: boolean;
  climatControl: boolean;
  childAutoseat: boolean;
}
export interface Car {
  id: number;
  img_url: string;
  title: string;
  price: number;
  owner_id: number;
  year: number;
  location: Location;
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
  features: Features;
  rating: number;
  comments: Array<number>;
  model: string;
}
export abstract class CarsService {
  constructor() { }
  abstract getTopCars(): Observable<Car[]>;
  abstract getCarById(id: number): Observable<Car>;
  abstract getCarsByUserId(id: number): Observable<Car[]>;
  abstract addCar(car: Car): Observable<boolean>;
  abstract editCar(car: Car): Observable<boolean>;
  abstract removeCar(id: number): Observable<boolean>;


}
