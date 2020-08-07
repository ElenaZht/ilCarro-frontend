import { Injectable } from '@angular/core';
import {RentService, Order} from './rent.service';
import {Observable} from 'rxjs';
import {environment} from './environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MockRentService implements RentService {

  constructor(private http: HttpClient) { }
  getCarsOrders(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/${id}`);
  }
  getMyOrders(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/myorder/${id}`);
  }
  addOrder(order: Order): Observable<boolean> {
    console.log(order);
    return this.http.post<boolean>(`${environment.apiUrl}/orders/addorder`, order);
  }
  getLastOrder(): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/lastorder`);
  }
  returnCar(order: Order): Observable<boolean> {
    console.log('before put of return', order);
    return this.http.put<boolean>(`${environment.apiUrl}/orders/returnorder`, order);
  }

  intermediateReturn(order: Order): Observable<boolean> {
    console.log('before put of intermediate return', order);
    return this.http.put<boolean>(`${environment.apiUrl}/orders/intermedreturnorder`, order);
  }
  cancelOrder(order: Order): Observable<boolean> {
    console.log('cancel order:', order);
    return this.http.put<boolean>(`${environment.apiUrl}/orders/cancelorder`, order);
  }
  cancelOrderByOwner(order: Order): Observable<boolean> {
    console.log('cancel order:', order);
    return this.http.put<boolean>(`${environment.apiUrl}/orders/cancelorderbyowner`, order);
  }

  getThisCarOrders(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/thiscarorder/${id}`);  }

}
