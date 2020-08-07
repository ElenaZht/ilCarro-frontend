import {Injectable} from '@angular/core';
import {User, UsersService, Comment} from './users.service';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './environments/environment';
import {Car} from './cars.service';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsersArrayService implements UsersService {
  currentUser: User;
  user$: BehaviorSubject<User>;
  constructor(private http: HttpClient) {

    const u = localStorage.getItem('user');
    if (u) {
      this.currentUser = JSON.parse(u);
      this.user$ = new BehaviorSubject(this.currentUser);
      // this.user$.next(this.currentUser);
      console.log('user session restored');
    } else {
      this.user$ = new BehaviorSubject(null);
    }
  }

  AddUser(user: User): Observable<boolean> {
    console.log(user);
    console.log(environment.apiUrl);
    return this.http.post<boolean>(`${environment.apiUrl}/users/signup`, user);

  }
  addComment(comment: Comment): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/comments/addcomment`, comment);
  }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/users/comments`);
  }
  logIn(email: string, password: string ): Observable<User> {
    this.http.post<User>(`${environment.apiUrl}/users/login`, {email, password})
      .subscribe(user => {
      console.log(user);
      if (user && user.token) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser = user;
        this.user$.next(user);
      }
    }, err => {
        console.log(err);
    });
    return this.user$.asObservable();
 }
  getCurrentUser(): User {
    return this.currentUser;
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser = null;
    this.user$.next(null);
  }

  isLoggedIn(): boolean {
    if (this.currentUser && this.currentUser.token) {
      return true;
    }
    return false;
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${environment.apiUrl}/comments/${id}`);
  }

  editUser(id: number, firstName: string, secondName: string, email: string, url: string): Observable<boolean> {
    // this.user$.next(this.currentUser);
    return this.http.put<boolean>(`${environment.apiUrl}/users/edituser`, {firstName, secondName, id, email, url}).pipe(map( res => {
      if (res) {
        console.log('change name status', res);
        this.currentUser.first_name = firstName;
        this.currentUser.second_name = secondName;
        this.currentUser.email = email;
        this.currentUser.url = url;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        }
      return res;
    }
    ));
  }

  getUser(): Observable<User> {
    return this.user$.asObservable();
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  test() {
    this.logout();
  }

  removeUser(id: number): Observable<boolean> {
    console.log('remove user: ', id);
    return this.http.delete<boolean>(`${environment.apiUrl}/users/removeuser/${id}`);
  }

}
