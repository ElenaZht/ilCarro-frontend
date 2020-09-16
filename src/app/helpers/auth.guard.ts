import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {User, UsersService} from '../users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  user: User;
  constructor(private auth: UsersService) {
    console.log('canActivate ctor');
    this.auth.getUser().subscribe(res => {
      this.user = res;
      console.log('this user guard', this.user);
    });
  }  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log('canActivate works', this.user);
    if (this.user && this.user.token) {
      return of(true);
    }
    console.log('protected by guard');
    return of(false);
  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(next, state);
  }
}
