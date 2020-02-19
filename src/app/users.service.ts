import {Observable} from 'rxjs';

export interface User {
  first_name: string;
  second_name: string;
  email: string;
  password: string;
}
export abstract class UsersService {
  abstract AddUser(user: User): Observable<boolean>;
}
