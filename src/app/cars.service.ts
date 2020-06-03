import {Observable} from 'rxjs';

export interface TopCar {
  url: string;
  title: string;
  price: number;
}
export abstract class CarsService {
  constructor() { }
  abstract getTopCars(): Observable<TopCar[]>;
}
