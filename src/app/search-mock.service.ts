import { Injectable } from '@angular/core';
import {Filter, SearchService} from './search.service';
import {Car} from './cars.service';
import {Observable} from 'rxjs';
import {environment} from './environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchMockService implements SearchService {

  constructor(private http: HttpClient) { }

  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${environment.apiUrl}/cars/allcars`);

  }

  getCarsByFilter(filter: Filter): Observable<Car[]> {
    return this.http.post<Car[]>(`${environment.apiUrl}/cars/filteredcars`, filter);

  }
}
