import {Observable} from 'rxjs';

export interface Order {
  orderId: number;
  carId: number;
  carName: string;
  carUrl: string;
  carOwnerId: number;
  carOwnerName: string;
  renterId: number;
  renterName: string;
  dateOn: any;
  dateOff: any;
  state: State;
}
export enum State {
  WaitToGo,
  OnTheWay,
  WaitToReturn,
  Returned,
  Canceled,
  CanceledByOwner
}
export abstract class RentService {
  abstract getCarsOrders(id: number): Observable<Order[]>;
  abstract getMyOrders(id: number): Observable<Order[]>;
  abstract getThisCarOrders(id: number): Observable<Order[]>;
  abstract addOrder(order: Order): Observable<boolean>;
  abstract returnCar(order: Order): Observable<boolean>;
  abstract intermediateReturn(order: Order): Observable<boolean>;
  abstract cancelOrder(order: Order): Observable<boolean>;
  abstract cancelOrderByOwner(order: Order): Observable<boolean>;
}
