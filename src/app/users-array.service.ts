import {Injectable} from '@angular/core';
import {User, UsersService, Comment} from './users.service';
import {Observable, of, Subject, throwError} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersArrayService implements UsersService {
  currentUser: User;
  constructor(private http: HttpClient) {
    const u = localStorage.getItem('user');
    if (u) {
      this.currentUser = JSON.parse(u);
      console.log('user session restored');
    }
  }

  AddUser(user: User): Observable<boolean> {
    console.log(user);
    console.log(environment.apiUrl);
    return this.http.post<boolean>(`${environment.apiUrl}/users/signup`, user);

  }

  getComments(n: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/users/comments`);
  }
  logIn(email: string, password: string ): Subject<User> {
    const subject = new Subject<User>();
    this.http.post<User>(`${environment.apiUrl}/users/login`, {email, password})
      .subscribe(user => {
      console.log(user);
      if (user && user.token) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser = user;
        subject.next(user);
      }
    }, err => {
        console.log(err);
        subject.error(err);
    });
    return subject;
 }
  getCurrentUser(): User {
    return this.currentUser;
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    if (this.currentUser && this.currentUser.token) {
      return true;
    }
    return false;
  }

}
