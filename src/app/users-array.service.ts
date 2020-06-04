import {Injectable} from '@angular/core';
import {User, UsersService, Comment} from './users.service';
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

  getComments(n: number): Observable<Comment[]> {
    const comments = [{
      url: '../../assets/face1.jpg',
      name: 'Alex',
      date: '22 september 2019',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. '
    },
      {
        url: '../../assets/face2.jpg',
        name: 'Shmulik',
        date: '12 december 2018',
        text: 'Ut enim ad minim veniam, quis nostrud exercitation .'
      },
      {url: '../../assets/face3.jpg', name: 'Ofir', date: '3 july 2019', text: ' Duis aute irure dolor in reprehenderit .'},
      {
        url: '../../assets/face4.jpg',
        name: 'Anne',
        date: '5 april 2019',
        text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.'
      },
      {url: '../../assets/face5.jpg', name: 'Shani', date: '23 november 2019', text: 'Quisque non tellus orci ac.'},
      {
        url: '../../assets/face6.jpg',
        name: 'Slava',
        date: '15 september 2018',
        text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.'
      }];
    return of(comments);
  }

}
