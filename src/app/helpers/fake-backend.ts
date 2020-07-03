import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../users.service';
import { Injectable } from '@angular/core';

const users: User[] = [{ id: 1, first_name: 'Lena', second_name: 'Zhytomirsky',
  email: 'elenazht@gmail.com', password: '12345678'}];
const comments = [{
  url: '../../assets/face1.jpg',
  name: 'Alex',
  date: '22 september 2019',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. '
},
  {
    url: '../../assets/face2.jpg',
    name: 'Shmulik',
    date: '12 december 2018',
    text: 'Ut enim ad minim veniam, quis nostrud exercitation .'
  },
  {url: '../../assets/face3.jpg', name: 'Ofir', date: '3 july 2019', text: ' Duis aute irure dolor in reprehenderit .'},
  {
    url: '../../assets/face4.jpg',
    name: 'Anne',
    date: '5 april 2019',
    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.'
  },
  {url: '../../assets/face5.jpg', name: 'Shani', date: '23 november 2019', text: 'Quisque non tellus orci ac.'},
  {
    url: '../../assets/face6.jpg',
    name: 'Slava',
    date: '15 september 2018',
    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.'
  }];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    console.log('intercepted by fake backend', body, url);
    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      // tslint:disable-next-line:max-line-length
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      if (true === url.endsWith('/users/signup') && method === 'POST') {
        if (users.find(u => u.email === body.email)) {
          return throwError({ status: 409, statusText: 'already exist'});
        }
        body.id = users.length + 1;
        users.push(body);
        console.log(users);
        return ok(true);
      }
      if (true === url.endsWith('/users/comments') && method === 'GET') {
        return ok(comments);
      }
      if (true === url.endsWith('users/login') && method === 'POST') {
        console.log('fake bakend login');
        const u = users.find(u => u.email === body.email);
        if (u && u.password === body.password) {
          u.token = 'jwt_token';
          return ok(u);
        } else {
          return throwError({ status: 401, statusText: 'Unauthorized'});
        }
      } else {
        return next.handle(request);
      }
    }

    function authenticate() {
      const { first_name, password } = body;
      const user = users.find(x => x.first_name === first_name && x.password === password);
      if (!user) { return error('Username or password is incorrect'); }
      return ok({
        id: user.id,
        first_name: user.first_name,
        last_name: user.second_name,
        email: user.email,
        token: 'fake-jwt-token'
      });
    }

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }
  }
}
