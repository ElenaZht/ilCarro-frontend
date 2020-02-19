import { Injectable } from '@angular/core';
import {User, UsersService} from './users.service';
import {Observable, of, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersArrayService implements UsersService {
users: User[] = [];
  constructor() {
  }
  AddUser(user: User): Observable<boolean> {
    console.log(user);
    if (this.users.find(u => u.email === user.email)) {
      return throwError('already exist');
    }
    this.users.push(user);
    console.log(this.users);
    return of(true);
  }

}
