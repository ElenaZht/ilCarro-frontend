import {Observable} from 'rxjs';

export interface User {
  first_name: string;
  second_name: string;
  email: string;
  password: string;
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
}
