import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../users.service';
import { Injectable } from '@angular/core';
import {Car} from '../cars.service';

let users: User[] = [
                    { url: '../../assets/user_photo.jpg', id: 1, first_name: 'Lena', second_name: 'Zhytomirsky',
                      email: 'elenazht@gmail.com', password: '12345678'},
                    {  url: '../../assets/face2.jpg', id: 120, first_name: 'Haim', second_name: 'Petrov',
                       email: 'haim@gmail.com', password: '12345678'},
                    {  url: '../../assets/face3.jpg', id: 121, first_name: 'Ori', second_name: 'Perez',
                      email: 'ori@gmail.com', password: '12345678'},
                    {  url: '../../assets/face4.jpg', id: 122, first_name: 'Ofira', second_name: 'Goldberg',
                      email: 'ofira@gmail.com', password: '12345678'},
                    {  url: '../../assets/face5.jpg', id: 123, first_name: 'Gal', second_name: 'Gadot',
                      email: 'gal@gmail.com', password: '12345678'},
                    {  url: '../../assets/face6.jpg', id: 124, first_name: 'Isak', second_name: 'Pinsky',
                      email: 'isak@gmail.com', password: '12345678'}
                      ];
let cars: Car[] = [
  { id: 100, img_url: '../../assets/azlk.jpg', title: 'azlk', price: 200, owner_id: 121, year: 2010, location: 'Ulitsa Generala Lizyukova, 4, Voronezh, Voronezh Oblast, Russia, 394053', engine: '3.0L V6 DOHC',
    fuel: 'Gas', gear: 'Automatic', fuel_cons: '12 l/100km', wd: 'RWD', hp: 250, torque: 330, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features: ['22 inch wheels', 'Power gestured roof', 'Heated front seats', 'Heated steering wheel', 'Ambient interior lighting', 'Meridian sound system', 'Interactive driver display', 'Lane departure warning', 'Emergency braking', 'Traffic sign recognition', 'Adaptive speed limiter'],
    rating: 4, comments: [1367, 7654, 3398]},
  { id: 101, img_url: '../../assets/zaz.jpg', title: 'zaz', price: 180, owner_id: 121, year: 2008, location: 'Ulitsa Generala Lizyukova, 4, Voronezh, Voronezh Oblast, Russia, 394053', engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Mehanic', fuel_cons: '10 l/100km', wd: 'RWD', hp: 200, torque: 330, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features: ['22 inch wheels', 'Power gestured roof', 'Heated front seats', 'Heated steering wheel', 'Ambient interior lighting', 'Meridian sound system', 'Interactive driver display', 'Lane departure warning', 'Emergency braking', 'Traffic sign recognition', 'Adaptive speed limiter'],
    rating: 3, comments: [1555, 7654, 7359]},
  { id: 102, img_url: '../../assets/gaz.jpg', title: 'gaz', price: 170, owner_id: 120, year: 1999, location: 'Ulitsa Pervomaiskaya, 7, Minsk, Minskaya Oblast, Belarus, 394073', engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Mehanic', fuel_cons: '8 l/100km', wd: 'RWD', hp: 180, torque: 300, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features: ['22 inch wheels', 'Power gestured roof', 'Heated front seats', 'Heated steering wheel', 'Ambient interior lighting', 'Meridian sound system', 'Interactive driver display', 'Lane departure warning', 'Emergency braking', 'Traffic sign recognition', 'Adaptive speed limiter'],
    rating: 5, comments: [3333, 8888, 9999]},
  { id: 103, img_url: '../../assets/bmv.jpg', title: 'BMV', price: 200, owner_id: 122, year: 2018, location: 'Ulitsa HaBika, 9, Holon, Gush Dan, Israel, 394883', engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '15 l/100km', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features: ['22 inch wheels', 'Power gestured roof', 'Heated front seats', 'Heated steering wheel', 'Ambient interior lighting', 'Meridian sound system', 'Interactive driver display', 'Lane departure warning', 'Emergency braking', 'Traffic sign recognition', 'Adaptive speed limiter'],
    rating: 5, comments: [1111, 2222, 4444]},
  { id: 104, img_url: '../../assets/ford_fiesta.jpg', title: 'Foed Fiesta', price: 190, owner_id: 122, year: 2017, location: 'Ulitsa Lechi, 14, Ramat Gan, Gush Dan, Israel, 394883', engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '15 l/100km', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features: ['22 inch wheels', 'Power gestured roof', 'Heated front seats', 'Heated steering wheel', 'Ambient interior lighting', 'Meridian sound system', 'Interactive driver display', 'Lane departure warning', 'Emergency braking', 'Traffic sign recognition', 'Adaptive speed limiter'],
    rating: 4, comments: [1222, 2111, 1221]},
  { id: 105, img_url: '../../assets/gaz2go.jpg', title: 'Gaz2Go', price: 100, owner_id: 122, year: 2020, location: 'Ulitsa Perez, 100, Tel Aviv, Gush Dan, Israel, 394883', engine: '3.0L V6 DOHC',
    fuel: 'Electrisity', gear: 'Automatic', fuel_cons: '15 l/100km', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features: ['22 inch wheels', 'Power gestured roof', 'Heated front seats', 'Heated steering wheel', 'Ambient interior lighting', 'Meridian sound system', 'Interactive driver display', 'Lane departure warning', 'Emergency braking', 'Traffic sign recognition', 'Adaptive speed limiter'],
    rating: 4, comments: [3222, 2333, 2323]},
  { id: 106, img_url: '../../assets/hendai.jpg', title: 'Hendai', price: 220, owner_id: 123, year: 2018, location: 'Ulitsa Ben Gurion, 1, Bat Yam, Gush Dan, Israel, 394883', engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '15 l/100km', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features: ['22 inch wheels', 'Power gestured roof', 'Heated front seats', 'Heated steering wheel', 'Ambient interior lighting', 'Meridian sound system', 'Interactive driver display', 'Lane departure warning', 'Emergency braking', 'Traffic sign recognition', 'Adaptive speed limiter'],
    rating: 5, comments: [1000, 1100, 1101]},
  { id: 107, img_url: '../../assets/honda_amaze.jpg', title: 'Honda Amaze', price: 300, owner_id: 123, year: 2020, location: 'Ulitsa Perez, 12, Holon, Gush Dan, Israel, 394883', engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '15 l/100km', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features: ['22 inch wheels', 'Power gestured roof', 'Heated front seats', 'Heated steering wheel', 'Ambient interior lighting', 'Meridian sound system', 'Interactive driver display', 'Lane departure warning', 'Emergency braking', 'Traffic sign recognition', 'Adaptive speed limiter'],
    rating: 5, comments: [3000, 3444, 3434]},
  { id: 108, img_url: '../../assets/mercedes_benz.jpg', title: 'Mercedes Benz', price: 220, owner_id: 123, year: 2019, location: 'Ulitsa Golda Meir, 9, Holon, Gush Dan, Israel, 394883', engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '15 l/100km', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features: ['22 inch wheels', 'Power gestured roof', 'Heated front seats', 'Heated steering wheel', 'Ambient interior lighting', 'Meridian sound system', 'Interactive driver display', 'Lane departure warning', 'Emergency braking', 'Traffic sign recognition', 'Adaptive speed limiter'],
    rating: 5, comments: [1111, 2222, 4444]},
  { id: 109, img_url: '../../assets/shelby.jpg', title: 'Shelby', price: 340, owner_id: 123, year: 2015, location: 'Ulitsa HaBika, 8, Ashdod, Gush Dan, Israel, 394883', engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '15 l/100km', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features: ['22 inch wheels', 'Power gestured roof', 'Heated front seats', 'Heated steering wheel', 'Ambient interior lighting', 'Meridian sound system', 'Interactive driver display', 'Lane departure warning', 'Emergency braking', 'Traffic sign recognition', 'Adaptive speed limiter'],
    rating: 3, comments: [1234, 4321, 2345]},
  { id: 110, img_url: '../../assets/suzuki_swift.jpg', title: 'Suzuki Swift', price: 110, owner_id: 121, year: 2009, location: 'Ulitsa HaBika, 9, Holon, Gush Dan, Israel, 394883', engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '15 l/100km', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features: ['22 inch wheels', 'Power gestured roof', 'Heated front seats', 'Heated steering wheel', 'Ambient interior lighting', 'Meridian sound system', 'Interactive driver display', 'Lane departure warning', 'Emergency braking', 'Traffic sign recognition', 'Adaptive speed limiter'],
    rating: 4, comments: [6543, 6789, 1480]}
];
let comments = [
                { id: 1000,
                  url: '../../assets/face1.jpg',
                  name: 'Alex',
                  date: '22 september 2019',
                  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. '
                },
                  { id: 1001,
                    url: '../../assets/face2.jpg',
                    name: 'Shmulik',
                    date: '12 december 2018',
                    text: 'Ut enim ad minim veniam, quis nostrud exercitation .'
                  },
                  {  id: 1002,
                    url: '../../assets/face3.jpg',
                    name: 'Ofir',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .'},
                  {  id: 1003,
                    url: '../../assets/face4.jpg',
                    name: 'Anne',
                    date: '5 april 2019',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.'
                  },
                  {id: 1004,
                    url: '../../assets/face5.jpg',
                    name: 'Shani',
                    date: '23 november 2019',
                    text: 'Quisque non tellus orci ac.'},
                  {  id: 1005,
                    url: '../../assets/face6.jpg',
                    name: 'Slava',
                    date: '15 september 2018',
                    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.'},
                  { id: 1006,
                    url: '../../assets/face1.jpg',
                    name: 'Alex',
                    date: '22 september 2019',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. '
                  },
                  { id: 1007,
                    url: '../../assets/face2.jpg',
                    name: 'Shmulik',
                    date: '12 december 2018',
                    text: 'Ut enim ad minim veniam, quis nostrud exercitation .'
                  },
                  {  id: 1008,
                    url: '../../assets/face3.jpg',
                    name: 'Ofir',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .'},
                  {  id: 1009,
                    url: '../../assets/face4.jpg',
                    name: 'Anne',
                    date: '5 april 2019',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.'
                  },
                  {id: 1010,
                    url: '../../assets/face5.jpg',
                    name: 'Shani',
                    date: '23 november 2019',
                    text: 'Quisque non tellus orci ac.'},
                  {  id: 1011,
                    url: '../../assets/face6.jpg',
                    name: 'Slava',
                    date: '15 september 2018',
                    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.'
                  },
                  { id: 1012,
                    url: '../../assets/face1.jpg',
                    name: 'Alex',
                    date: '22 september 2019',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. '
                  },
                  { id: 1013,
                    url: '../../assets/face2.jpg',
                    name: 'Shmulik',
                    date: '12 december 2018',
                    text: 'Ut enim ad minim veniam, quis nostrud exercitation .'
                  },
                  {  id: 1014,
                    url: '../../assets/face3.jpg',
                    name: 'Ofir',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .'},
                  {  id: 1015,
                    url: '../../assets/face4.jpg',
                    name: 'Anne',
                    date: '5 april 2019',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.'
                  },
                  {id: 1016,
                    url: '../../assets/face5.jpg',
                    name: 'Shani',
                    date: '23 november 2019',
                    text: 'Quisque non tellus orci ac.'},
                  {  id: 1017,
                    url: '../../assets/face6.jpg',
                    name: 'Slava',
                    date: '15 september 2018',
                    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.'
                  },
                  { id: 1018,
                    url: '../../assets/face1.jpg',
                    name: 'Alex',
                    date: '22 september 2019',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. '
                  },
                  { id: 1019,
                    url: '../../assets/face2.jpg',
                    name: 'Shmulik',
                    date: '12 december 2018',
                    text: 'Ut enim ad minim veniam, quis nostrud exercitation .'
                  },
                  {  id: 1020,
                    url: '../../assets/face3.jpg',
                    name: 'Ofir',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .'},
                  {  id: 1021,
                    url: '../../assets/face4.jpg',
                    name: 'Anne',
                    date: '5 april 2019',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.'
                  },
                  {id: 1022,
                    url: '../../assets/face5.jpg',
                    name: 'Shani',
                    date: '23 november 2019',
                    text: 'Quisque non tellus orci ac.'},
                  {  id: 1023,
                    url: '../../assets/face6.jpg',
                    name: 'Slava',
                    date: '15 september 2018',
                    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.'
                  },
                  { id: 1024,
                    url: '../../assets/face1.jpg',
                    name: 'Alex',
                    date: '22 september 2019',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. '
                  },
                  { id: 1025,
                    url: '../../assets/face2.jpg',
                    name: 'Shmulik',
                    date: '12 december 2018',
                    text: 'Ut enim ad minim veniam, quis nostrud exercitation .'
                  },
                  {  id: 1026,
                    url: '../../assets/face3.jpg',
                    name: 'Ofir',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .'},
                  {  id: 1027,
                    url: '../../assets/face4.jpg',
                    name: 'Anne',
                    date: '5 april 2019',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.'
                  },
                  {id: 1028,
                    url: '../../assets/face5.jpg',
                    name: 'Shani',
                    date: '23 november 2019',
                    text: 'Quisque non tellus orci ac.'},
                  {  id: 1029,
                    url: '../../assets/face6.jpg',
                    name: 'Slava',
                    date: '15 september 2018',
                    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.'
                  },
                  { id: 1030,
                    url: '../../assets/face1.jpg',
                    name: 'Alex',
                    date: '22 september 2019',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. '
                  }
                  ];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    console.log('intercepted by fake backend url no', url.substring(0, url.lastIndexOf('/')));
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
      }
      if (true === url.substring(0, url.lastIndexOf('/')).endsWith('/car') && method === 'GET') {
        console.log("*****************");
        const id = parseInt(url.substring(url.lastIndexOf('/') + 1));
        if (id) {
          const car = cars.find(c => c.id === id);
          if (car) {
            return ok(car);
          } else {
            return throwError({ status: 404, statusText: 'Car not found'});
          }
        }
      }
      if (true === url.substring(0, url.lastIndexOf('/')).endsWith('cars/user') && method === 'GET') {
        const userId = parseInt(url.substring(url.lastIndexOf('/') + 1));
        return ok( cars.filter(c => c.owner_id === userId));
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
