import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { UsersService } from '../users.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private usersService: UsersService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('request intercepted jwt');
    // add authorization header with jwt token if available
    const currentUser = this.usersService.getCurrentUser();
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    return next.handle(request)
      .pipe(catchError(err => {
      if (err.status === 401 && this.usersService.isLoggedIn()) {
        this.usersService.logout();
        location.reload();
      }
      console.log('error');
      return throwError(err);
    }));
  }
}
