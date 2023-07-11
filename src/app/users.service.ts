import {Observable} from 'rxjs';

export interface User {
  url: string;
  id: number;
  first_name: string;
  second_name: string;
  email: string;
  password: string;
  token?: string;
}
export interface Comment {
  url: string;
  name: string;
  date: any;
  text: string;
  id: number;
  carId: number;
  stars: number;
}
export abstract class UsersService {
  abstract AddUser(user: User): Observable<boolean>;
  abstract removeUser(id: number): Observable<boolean>;
  abstract getComments(): Observable<Comment[]>;
  abstract getCommentById(id: number): Observable<Comment>;
  abstract addComment(comment: Comment): Observable<boolean>;
  abstract logIn(email: string, password: string ): Observable<boolean>;
  abstract logout();
  abstract isLoggedIn(): boolean;
  abstract editUser(id: number, firstName: string, secondName: string, email: string, url: string): Observable<boolean>;
  abstract getUser(): Observable<User>;

}
