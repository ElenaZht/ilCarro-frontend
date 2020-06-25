import {Observable, Subject} from 'rxjs';
import {until} from 'selenium-webdriver';
import ableToSwitchToFrame = until.ableToSwitchToFrame;

export interface User {
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
}
export abstract class UsersService {
  abstract AddUser(user: User): Observable<boolean>;
  abstract getComments(n: number): Observable<Comment[]>;
  abstract logIn(email: string, password: string ): Subject<User>;
  abstract getCurrentUser(): User;
  abstract logout();
  abstract isLoggedIn(): boolean;

}
