import { Injectable } from '@angular/core';
import {RentService, Order} from './rent.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from './environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockRentService implements RentService {
  carsOrders$: BehaviorSubject<Order[]> = new BehaviorSubject([]);
  myOrders$: BehaviorSubject<Order[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

  getCarsOrders(id: number): Observable<Order[]> {
    this.http.get<Order[]>(`${environment.apiUrl}/orders/${id}`).subscribe(
      res => {
        if (res) {
          this.carsOrders$.next(res);
        }
      }
    );
    return this.carsOrders$.asObservable();
  }
  getMyOrders(id: number): Observable<Order[]> {
    this.http.get<Order[]>(`${environment.apiUrl}/myorder/${id}`).subscribe(
      res => {
        if (res) {
          this.myOrders$.next(res);
        }
      }
    );
    return this.myOrders$.asObservable();

  }
  addOrder(order: Order): Observable<boolean> {
    console.log('rent server got date', order.dateOn, order.dateOff);
    const id = order.renterId;
    return  this.http.post<boolean>(`${environment.apiUrl}/orders/addorder`, order).pipe(map(
      res => {
        if (res) {
          this.refreshOrders(id);
        }
        return res;
      }
    ));

  }

  returnCar(order: Order): Observable<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/orders/returnorder`, order).pipe(map(
      res => {
        if (res) {
          this.refreshOrders(order.carOwnerId);
        }
        return res;
      }
    ));
  }

  intermediateReturn(order: Order): Observable<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/orders/intermedreturnorder`, order).pipe(map(
      res => {
        if (res) {
          this.refreshOrders(order.renterId);
        }
        return res;
      }
    ));
  }
  cancelOrder(order: Order): Observable<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/orders/cancelorder`, order).pipe(map(
      res => {
        if (res) {
          this.myOrders$.next(this.myOrders$.getValue().filter(o => o.orderId !== order.orderId));
        }
        return res;
      }
    ));
  }
  cancelOrderByOwner(order: Order): Observable<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/orders/cancelorderbyowner`, order).pipe(map(
      res => {
        if (res) {
          this.carsOrders$.next(this.carsOrders$.getValue().filter(o => o.orderId !== order.orderId));

        }
        return res;
      }
    ));
  }

  getThisCarOrders(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/thiscarorder/${id}`);
  }

  refreshOrders(id: number) {
    this.http.get<Order[]>(`${environment.apiUrl}/orders/${id}`).subscribe(
      resMyCars => {
        if (resMyCars) {
          this.carsOrders$.next(resMyCars);
        }
      });
    this.http.get<Order[]>(`${environment.apiUrl}/myorder/${id}`).subscribe(
      resMyOrders => {
        if (resMyOrders) {
          this.myOrders$.next(resMyOrders);
        }
      });
  }
}
