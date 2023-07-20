import {Injectable} from '@angular/core';
import {User, UsersService, Comment} from './users.service';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './environments/environment';
import {catchError, map} from 'rxjs/operators';


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
    } else {
      this.user$ = new BehaviorSubject(null);
    }
  }

  AddUser(user: User): Observable<boolean> {
    // this.logIn(user.email, user.password);
    return this.http.post<boolean>(`${environment.apiUrl}/users/signup`, user);

  }
  addComment(comment: Comment): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/comments/addcomment`, comment);
  }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/users/comments`);
  }
  logIn(email: string, password: string ): Observable<boolean> {
    return this.http.post<User>(`${environment.apiUrl}/users/login`, {email, password})
      .pipe(map(user => {
      if (user && user.token) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser = user;
        this.user$.next(user);
        return true;
      }
      return false;
    }), catchError(err => {
          this.logout();
          return throwError(err.statusText);
      }));
 }

  logout() {
    localStorage.removeItem('user');
    this.currentUser = null;
    this.user$.next(null);
  }

  isLoggedIn(): boolean {
    return !!(this.currentUser && this.currentUser.token);

  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${environment.apiUrl}/comments/${id}`);
  }

  editUser(id: number, firstName: string, secondName: string, email: string, url: string): Observable<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}/users/edituser`, {firstName, secondName, id, email, url}).pipe(map( res => {
      if (res) {
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

  removeUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/users/removeuser/${id}`);
  }

}
