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
    console.log('into func getcarsorders');
    this.http.get<Order[]>(`${environment.apiUrl}/orders/${id}`).subscribe(
      res => {
        if (res) {
          this.carsOrders$.next(res);
          console.log('cars orders res', res);
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
          console.log('my orders res', res);
        }
      }
    );
    return this.myOrders$.asObservable();

  }
  addOrder(order: Order): Observable<boolean> {
    console.log(order);
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
    console.log('before put of return', order);
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
    console.log('before put of intermediate return', order);
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
    console.log('cancel order:', order);
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
    console.log('OWNER cancel order:', order);
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
          console.log('cars orders res', resMyCars);
        }
      });
    this.http.get<Order[]>(`${environment.apiUrl}/myorder/${id}`).subscribe(
      resMyOrders => {
        if (resMyOrders) {
          this.myOrders$.next(resMyOrders);
          console.log('my orders res', resMyOrders);
        }
      });
  }
}
