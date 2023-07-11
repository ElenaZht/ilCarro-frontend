import {Injectable, OnDestroy} from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import {User, UsersService} from '../users.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor, OnDestroy {
  user: User;
  private getUserSubscription;
  // todo constr
  constructor(private usersService: UsersService) {
    this.getUserSubscription = this.usersService.getUser().subscribe(res => {
      this.user = res;
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.user && this.user.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.user.token}`
        }
      });
    }

    return next.handle(request)
      .pipe(catchError(err => {
      if (err.status === 401 && this.usersService.isLoggedIn()) {
        this.usersService.logout();
        location.reload();
      }
      return throwError(err);
    }));
  }
  ngOnDestroy(): void {
    this.getUserSubscription.unsubscribe();
  }
}
