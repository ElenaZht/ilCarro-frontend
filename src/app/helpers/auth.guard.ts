import {Injectable, OnDestroy} from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {User, UsersService} from '../users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, OnDestroy {
  user: User;
  private getUserSubscription;
  constructor(private auth: UsersService) {
    this.getUserSubscription = this.auth.getUser().subscribe(res => {
      this.user = res;
    });
  }  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.user && this.user.token) {
      return of(true);
    }
    return of(false);
  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(next, state);
  }
  ngOnDestroy(): void {
    this.getUserSubscription.unsubscribe();
  }
}
