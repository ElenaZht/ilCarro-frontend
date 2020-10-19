import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Car, Features, Location} from './cars.service';


export interface Filter {
  price: number;
  rating: number;
  dateOn: Date;
  dateOff: Date;
  features: Features;
  gear: string;
  year: number;
  class: string;
  location: Location;
  city: string;
  rad: number;
}
@Injectable({
  providedIn: 'root'
})
export abstract class SearchService {
  abstract getAllCars(): Observable<Car[]>;
  abstract getCarsByFilter(filter: Filter): Observable<Car[]>;
  constructor() { }
}
