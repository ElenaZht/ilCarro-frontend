import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../users.service';
import { Injectable } from '@angular/core';
import {Car} from '../cars.service';
import {State, Order} from '../rent.service';

const users_init: User[] = [
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
const cars_init: Car[] = [
  { id: 100, img_url: '../../assets/azlk.jpg', title: 'AZLK', model: '2140',  price: 200, owner_id: 121, year: 2010, location: {country: 'Russia', city: 'Voronezh', region: 'Voronezh Oblast', street: 'Ulitsa Generala Lizyukova, 4', zip: 394053, lat: 51.6605982, lng: 39.2005858}, engine: '3.0L V6 DOHC',
    fuel: 'Gas', gear: 'Automatic', fuel_cons: '12l', wd: 'RWD', hp: 250, torque: 330, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features: {multimediaDisplay: false, abs: false, climatControl: false, childAutoseat: false},
    rating: 4, comments: [1000, 1001, 1002]},
  { id: 101, img_url: '../../assets/zaz.jpg', title: 'ZAZ', model: '200',  price: 180, owner_id: 121, year: 2008,  location: {country: 'Russia', city: 'Voronezh', region: 'Voronezh Oblast', street: 'Ulitsa Generala Lizyukova, 4', zip: 394053, lat: 51.6605982, lng: 39.2005858}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Mehanic', fuel_cons: '101', wd: 'RWD', hp: 200, torque: 330, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features: {multimediaDisplay: true, abs: true, climatControl: true, childAutoseat: false},
    rating: 3, comments: [1003, 1004, 1005]},
  { id: 102, img_url: '../../assets/gaz.jpg', title: 'GAZ', model: '02',  price: 170, owner_id: 120, year: 1999,  location: {country: 'Russia', city: 'Voronezh', region: 'Voronezh Oblast', street: 'Ulitsa Generala Lizyukova, 4', zip: 394053, lat: 51.6605982, lng: 39.2005858}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Mehanic', fuel_cons: '80', wd: 'RWD', hp: 180, torque: 300, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features: {multimediaDisplay: false, abs: false, climatControl: false, childAutoseat: true},
    rating: 5, comments: [1006, 1007, 1008]},
  { id: 103, img_url: '../../assets/bmv.jpg', title: 'BMV', model: 'x6', price: 200, owner_id: 122, year: 2018, location: {country: 'Israel', city: 'Holon', region: 'Gush Dan', street: 'Ulitsa HaBika, 9', zip: 394883, lat: 32.0193121, lng: 34.7804076}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '150', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features: {multimediaDisplay: true, abs: true, climatControl: true, childAutoseat: false},
    rating: 5, comments: [1009, 1010, 1011]},
  { id: 104, img_url: '../../assets/ford_fiesta.jpg', title: 'Ford', model: 'Fiesta', price: 190, owner_id: 122, year: 2017, location: {country: 'Israel', city: 'Ramat Gan', region: 'Gush Dan', street: 'Ulitsa Lechi, 14', zip: 394883, lat: 32.0686867, lng: 34.8246812}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '150', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features:  {multimediaDisplay: true, abs: true, climatControl: false, childAutoseat: false},
    rating: 4, comments: [1012, 1013, 1014]},
  { id: 105, img_url: '../../assets/gaz2go.jpg', title: 'Gaz2Go', model: 'Mini',  price: 100, owner_id: 122, year: 2020, location: {country: 'Israel', city: 'Tel Aviv', region: 'Gush Dan', street: 'Ulitsa Perez, 100', zip: 394883, lat: 32.0804808, lng: 34.7805274}, engine: '3.0L V6 DOHC',
    fuel: 'Electrisity', gear: 'Automatic', fuel_cons: '150', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features: {multimediaDisplay: true, abs: true, climatControl: true, childAutoseat: false},
    rating: 4, comments: [1015, 1016, 1017]},
  { id: 106, img_url: '../../assets/hendai.jpg', title: 'Hendai', model: 'Genesis G70', price: 220, owner_id: 123, year: 2018, location: {country: 'Israel', city: 'Bat Yam', region: 'Gush Dan', street: 'Ulitsa Ben Gurion, 1', zip: 394883, lat: 32.0154565, lng: 34.7505283}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '150', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features:  {multimediaDisplay: true, abs: true, climatControl: true, childAutoseat: true},
    rating: 5, comments: [1018, 1019, 1020]},
  { id: 107, img_url: '../../assets/honda_amaze.jpg', title: 'Honda', model: 'Amaze', price: 300, owner_id: 123, year: 2020, location: {country: 'Israel', city: 'Holon', region: 'Gush Dan', street: 'Ulitsa Perez, 12', zip: 394883, lat: 32.0193121, lng: 34.7804076}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '180', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features: {multimediaDisplay: true, abs: true, climatControl: true, childAutoseat: false},
    rating: 5, comments: [1021, 1023]},
  { id: 108, img_url: '../../assets/mercedes_benz.jpg', title: 'Mercedes', model: 'Benz', price: 220, owner_id: 123, year: 2019, location: {country: 'Israel', city: 'Holon', region: 'Gush Dan', street: 'Ulitsa Golda Meir, 9', zip: 394883, lat: 32.0193121, lng: 34.7804076}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '200', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features:  {multimediaDisplay: true, abs: true, climatControl: true, childAutoseat: false},
    rating: 5, comments: [1024, 1025, 1026]},
  { id: 109, img_url: '../../assets/shelby.jpg', title: 'Shelby', model: 'Cobra', price: 340, owner_id: 123, year: 2015, location: {country: 'Israel', city: 'Ashdod', region: 'Gush Dan', street: 'Ulitsa HaBika, 8', zip: 394883, lat: 31.7977307, lng: 34.652994}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '300', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features: {multimediaDisplay: true, abs: true, climatControl: true, childAutoseat: false},
    rating: 3, comments: [1027, 1028, 1029]},
  { id: 110, img_url: '../../assets/suzuki_swift.jpg', title: 'Suzuki', model: 'Swift', price: 110, owner_id: 121, year: 2009, location: {country: 'Israel', city: 'Holon', region: 'Gush Dan', street: 'Ulitsa HaBika, 9', zip: 394883, lat: 32.0193121, lng: 34.7804076}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Automatic', fuel_cons: '80', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB, touch screen interface with navigation and interactive driver display. ADDITIONAL CUSTOM UPGRADES INCLUDE painted brake calibers yellow with decals, powder coated wheels gloss black, window tint 35%, and full blackout package.',
    features:  {multimediaDisplay: false, abs: true, climatControl: false, childAutoseat: false},
    rating: 4, comments: [1030, 1022]}
];
const comments_init = [
                { id: 1000,
                  url: '../../assets/face1.jpg',
                  name: 'Alex',
                  date: '22 september 2019',
                  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. ',
                  carId: 100,
                  stars: 4
                },
                  { id: 1001,
                    url: '../../assets/face2.jpg',
                    name: 'Shmulik',
                    date: '12 december 2018',
                    text: 'Ut enim ad minim veniam, quis nostrud exercitation .',
                    carId: 100,
                    stars: 5

                  },
                  {  id: 1002,
                    url: '../../assets/face3.jpg',
                    name: 'Ofir',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .',
                    carId: 100,
                    stars: 5
                  },
                  {  id: 1003,
                    url: '../../assets/face4.jpg',
                    name: 'Anne',
                    date: '5 april 2019',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.',
                    carId: 101,
                    stars: 3

                  },
                  {id: 1004,
                    url: '../../assets/face5.jpg',
                    name: 'Shani',
                    date: '23 november 2019',
                    text: 'Quisque non tellus orci ac.',
                    carId: 101,
                    stars: 2
                  },
                  {  id: 1005,
                    url: '../../assets/face6.jpg',
                    name: 'Slava',
                    date: '15 september 2018',
                    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.',
                    carId: 101,
                    stars: 5
                  },
                  { id: 1006,
                    url: '../../assets/face1.jpg',
                    name: 'Alex',
                    date: '22 september 2019',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. ',
                    carId: 102,
                    stars: 4
                  },
                  { id: 1007,
                    url: '../../assets/face2.jpg',
                    name: 'Shmulik',
                    date: '12 december 2018',
                    text: 'Ut enim ad minim veniam, quis nostrud exercitation .',
                    carId: 102,
                    stars: 3
                  },
                  {  id: 1008,
                    url: '../../assets/face3.jpg',
                    name: 'Ofir',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .',
                    carId: 102,
                    stars: 5
                  },
                  {  id: 1009,
                    url: '../../assets/face4.jpg',
                    name: 'Anne',
                    date: '5 april 2019',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.',
                    carId: 103,
                    stars: 5
                  },
                  {id: 1010,
                    url: '../../assets/face5.jpg',
                    name: 'Shani',
                    date: '23 november 2019',
                    text: 'Quisque non tellus orci ac.',
                    carId: 103,
                    stars: 5
                  },
                  {  id: 1011,
                    url: '../../assets/face6.jpg',
                    name: 'Slava',
                    date: '15 september 2018',
                    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.',
                    carId: 103,
                    stars: 1
                  },
                  { id: 1012,
                    url: '../../assets/face1.jpg',
                    name: 'Alex',
                    date: '22 september 2019',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. ',
                    carId: 104,
                    stars: 4
                  },
                  { id: 1013,
                    url: '../../assets/face2.jpg',
                    name: 'Shmulik',
                    date: '12 december 2018',
                    text: 'Ut enim ad minim veniam, quis nostrud exercitation .',
                    carId: 104,
                    stars: 4
                  },
                  {  id: 1014,
                    url: '../../assets/face3.jpg',
                    name: 'Ofir',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .',
                    carId: 104,
                    stars: 3
                  },
                  {  id: 1015,
                    url: '../../assets/face4.jpg',
                    name: 'Anne',
                    date: '5 april 2019',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.',
                    carId: 105,
                    stars: 5
                  },
                  {id: 1016,
                    url: '../../assets/face5.jpg',
                    name: 'Shani',
                    date: '23 november 2019',
                    text: 'Quisque non tellus orci ac.',
                    carId: 105,
                    stars: 5
                  },
                  {  id: 1017,
                    url: '../../assets/face6.jpg',
                    name: 'Slava',
                    date: '15 september 2018',
                    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.',
                    carId: 105,
                    stars: 5
                  },
                  { id: 1018,
                    url: '../../assets/face1.jpg',
                    name: 'Alex',
                    date: '22 september 2019',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. ',
                    carId: 106,
                    stars: 2
                  },
                  { id: 1019,
                    url: '../../assets/face2.jpg',
                    name: 'Shmulik',
                    date: '12 december 2018',
                    text: 'Ut enim ad minim veniam, quis nostrud exercitation .',
                    carId: 106,
                    stars: 4
                  },
                  {  id: 1020,
                    url: '../../assets/face3.jpg',
                    name: 'Ofir',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .',
                    carId: 106,
                    stars: 5
                  },
                  {  id: 1021,
                    url: '../../assets/face4.jpg',
                    name: 'Anne',
                    date: '5 april 2019',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.',
                    carId: 107,
                    stars: 4
                  },
                  {id: 1022,
                    url: '../../assets/face5.jpg',
                    name: 'Shani',
                    date: '23 november 2019',
                    text: 'Quisque non tellus orci ac.',
                    carId: 110,
                    stars: 4
                  },
                  {  id: 1023,
                    url: '../../assets/face6.jpg',
                    name: 'Slava',
                    date: '15 september 2018',
                    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.',
                    carId: 107,
                    stars: 5
                  },
                  { id: 1024,
                    url: '../../assets/face1.jpg',
                    name: 'Alex',
                    date: '22 september 2019',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. ',
                    carId: 108,
                    stars: 5
                  },
                  { id: 1025,
                    url: '../../assets/face2.jpg',
                    name: 'Shmulik',
                    date: '12 december 2018',
                    text: 'Ut enim ad minim veniam, quis nostrud exercitation .',
                    carId: 108,
                    stars: 3
                  },
                  {  id: 1026,
                    url: '../../assets/face3.jpg',
                    name: 'Ofir',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .',
                    carId: 108,
                    stars: 2
                  },
                  {  id: 1027,
                    url: '../../assets/face4.jpg',
                    name: 'Anne',
                    date: '5 april 2019',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.',
                    carId: 109,
                    stars: 4
                  },
                  {id: 1028,
                    url: '../../assets/face5.jpg',
                    name: 'Shani',
                    date: '23 november 2019',
                    text: 'Quisque non tellus orci ac.',
                    carId: 109,
                    stars: 5
                  },
                  {  id: 1029,
                    url: '../../assets/face6.jpg',
                    name: 'Slava',
                    date: '15 september 2018',
                    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.',
                    carId: 109,
                    stars: 3
                  },
                  { id: 1030,
                    url: '../../assets/face1.jpg',
                    name: 'Alex',
                    date: '22 september 2019',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. ',
                    carId: 110,
                    stars: 5
                  }
                  ];
const orders_init: Order[] = [
  {
    orderId: 0,
    carId: 100,
    carName: 'AZLK',
    carUrl: '../../assets/azlk.jpg',
    carOwnerId: 121,
    carOwnerName: 'Ori Perez',
    renterId: 124,
    renterName: 'Isak Pinsky',
    dateOn: 'Wed, 12 Aug 2020 09:00:00 GMT',
    dateOff: 'Thu, 13 Aug 2020 09:00:00 GMT',
    state: State.WaitToGo
  },
  {
    orderId: 1,
    carId: 100,
    carName: 'AZLK',
    carUrl: '../../assets/azlk.jpg',
    carOwnerId: 121,
    carOwnerName: 'Ori Perez',
    renterId: 123,
    renterName: 'Gal Gadot',
    dateOn: 'Fri, 10 Jul 2020 09:00:00 GMT',
    dateOff: 'Sat, 11 Jul 2020 09:00:00 GMT',
    state: State.Returned

  },
  {
    orderId: 2,
    carId: 101,
    carName: 'ZAZ',
    carUrl: '../../assets/zaz.jpg',
    carOwnerId: 121,
    carOwnerName: 'Ori Perez',
    renterId: 122,
    renterName: 'Ofra Goldberg',
    dateOn: 'Fri, 21 Aug 2020 13:00:00 GMT',
    dateOff: 'Sat, 22 Aug 2020 13:00:00 GMT',
    state: State.WaitToGo
  },
  {
    orderId: 3,
    carId: 102,
    carName: 'GAZ',
    carUrl: '../../assets/gaz.jpg',
    carOwnerId: 120,
    carOwnerName: 'Haim Petrov',
    renterId: 124,
    renterName: 'Isak Pinsky',
    dateOn: 'Wed, 01 Jan 2020 07:00:00 GMT',
    dateOff: 'Sun, 05 Jan 2020 07:00:00 GMT',
    state: State.Returned

  },
  {
    orderId: 4,
    carId: 103,
    carName: 'BMV',
    carUrl: '../../assets/bmv.jpg',
    carOwnerId: 122,
    carOwnerName: 'Ofra Goldberg',
    renterId: 120,
    renterName: 'Haim Petrov',
    dateOn: 'Sat, 01 Aug 2020 16:00:00 GMT',
    dateOff: 'Mon, 03 Aug 2020 16:00:00 GMT',
    state: State.OnTheWay

  },
  {
    orderId: 5,
    carId: 104,
    carName: 'Ford',
    carUrl: '../../assets/ford_fiesta.jpg',
    carOwnerId: 122,
    carOwnerName: 'Ofra Goldberg',
    renterId: 123,
    renterName: 'Gal Gadot',
    dateOn: 'Sat, 10 Oct 2020 09:00:00 GMT',
    dateOff: 'Sat, 10 Oct 2020 20:00:00 GMT',
    state: State.WaitToGo

  },
  {
    orderId: 6,
    carId: 106,
    carName: 'Hendai',
    carUrl: '../../assets/hendai.jpg',
    carOwnerId: 123,
    carOwnerName: 'Gal Gadot',
    renterId: 121,
    renterName: 'Ori Perez',
    dateOn: 'Mon, 01 Jun 2020 06:00:00 GMT',
    dateOff: 'Tue, 02 Jun 2020 09:00:00 GMT',
    state: State.Returned

  },
  {
    orderId: 7,
    carId: 106,
    carName: 'Hendai',
    carUrl: '../../assets/hendai.jpg',
    carOwnerId: 123,
    carOwnerName: 'Gal Gadot',
    renterId: 120,
    renterName: 'Haim Petrov',
    dateOn: 'Sat, 30 May 2020 09:00:00 GMT',
    dateOff: 'Tue, 02 Jun 2020 09:00:00 GMT',
    state: State.Returned

  },
  {
    orderId: 8,
    carId: 107,
    carName: 'Honda',
    carUrl: '../../assets/honda_amaze.jpg',
    carOwnerId: 123,
    carOwnerName: 'Gal Gadot',
    renterId: 121,
    renterName: 'Ori Perez',
    dateOn: 'Wed, 12 Aug 2020 10:00:00 GMT',
    dateOff: 'Thu, 13 Aug 2020 10:00:00 GMT',
    state: State.WaitToGo

  },
  {
    orderId: 9,
    carId: 110,
    carName: 'Suzuki',
    carUrl: '../../assets/suzuki_swift.jpg',
    carOwnerId: 121,
    carOwnerName: 'Ori Perez',
    renterId: 122,
    renterName: 'Ofra Goldberg',
    dateOn: 'Fri, 14 Feb 2020 10:00:00 GMT',
    dateOff: 'Sun, 16 Feb 2020 10:00:00 GMT',
    state: State.Returned

  },
  {
    orderId: 10,
    carId: 109,
    carName: 'Shelby',
    carUrl: '../../assets/shelby.jpg',
    carOwnerId: 123,
    carOwnerName: 'Gal Gadot',
    renterId: 124,
    renterName: 'Isak Pinsky',
    dateOn: 'Fri, 30 Oct 2020 10:00:00 GMT',
    dateOff: 'Sat, 31 Oct 2020 10:00:00 GMT',
    state: State.Canceled

  },
  {
    orderId: 11,
    carId: 110,
    carName: 'Suzuki',
    carUrl: '../../assets/suzuki_swift.jpg',
    carOwnerId: 121,
    carOwnerName: 'Ori Perez',
    renterId: 124,
    renterName: 'Isak Pinsky',
    dateOn: 'Tue, 01 Sep 2020 05:00:00 GMT',
    dateOff: 'Thu, 03 Sep 2020 05:00:00 GMT',
    state: State.Canceled

  },

];

function getCars() {
  return  JSON.parse(localStorage.getItem('cars'));
}

function addCar(car) {
  let cars = getCars();
  cars.push(car);
  localStorage.setItem('cars', JSON.stringify(cars));
  console.log('cars after add: ', cars);
}

function updateCar(carID, newValue) {
  let cars = getCars();
  const idx = cars.findIndex(c => c.id === carID);
  cars[idx] = newValue;
  localStorage.setItem('cars', JSON.stringify(cars));
  console.log('car to be', newValue);
  console.log('car after update', cars[idx]);
}
function removeCar(carID) {
  console.log('fake delete car');
  let cars = getCars()
  const i = cars.findIndex(car => car.id === carID);
  cars.splice(i, 1);
  console.log(cars);
  localStorage.setItem('cars', JSON.stringify(cars));
}
function getUsers() {
  return  JSON.parse(localStorage.getItem('users'));
}
function updateUser(userID, newValue) {
  console.log('fake update user');
  let users = getUsers();
  const idx = users.findIndex(c => c.id === userID);
  if (idx > 0) {
    users[idx] = newValue;
    console.log(users[idx]);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }
  return false;
}

function addUser(user) {
  let users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  console.log('users after add: ', users);
}
function removeUser(userID) {
  console.log('fake delete user');
  let users = getUsers();
  const i = users.findIndex(car => car.id === userID);
  if (i > 0) {
    users.splice(i, 1);
    console.log(users);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }
  return false;
}
function getComments() {
  return  JSON.parse(localStorage.getItem('comments'));
}
function addComment(comment) {
  let comments = getComments();
  comments.push(comment);
  localStorage.setItem('comments', JSON.stringify(comments));
  console.log('comments after add: ', comments);
}
function getOrders() {
  return  JSON.parse(localStorage.getItem('orders'));
}
function addOrder(order) {
  let orders = getOrders();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  console.log('orders after add: ', orders);
}
function updateOrder(order) {
  let orders = getOrders();
  const idx = orders.findIndex(c => c.orderId === order.orderId);
  orders[idx] = order;
  localStorage.setItem('orders', JSON.stringify(orders));
  console.log('orders after update: ', orders);

}

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {
    console.log('FAKE BACKEND Ctor');
    const checkCars = localStorage.getItem('cars');
    if (!checkCars) {
      localStorage.setItem('cars', JSON.stringify(cars_init));
    }
    const checkUsers = localStorage.getItem('users');
    if (!checkUsers) {
      localStorage.setItem('users', JSON.stringify(users_init));
    }
    const checkComments = localStorage.getItem('comments');
    if (!checkComments) {
      localStorage.setItem('comments', JSON.stringify(comments_init));
    }
    const checkOrders = localStorage.getItem('orders');
    if (!checkOrders) {
      localStorage.setItem('orders', JSON.stringify(orders_init));
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;
    // console.log('intercepted by fake backend url no', url.substring(0, url.lastIndexOf('/')));
    console.log('intercepted by fake backend', body, url, method);
    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      // tslint:disable-next-line:max-line-length
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/signup') && method === 'POST' :
          if (getUsers().find(u => u.email === body.email)) {
                return throwError({status: 409, statusText: 'already exist'});
              }
          body.id = getUsers().length + 1;
          addUser(body);
          return ok(true);
        case url.endsWith('/comments/addcomment') && method === 'POST' :
          body.id = getComments().length + 1000;
          addComment(body);
          const currentCar = getCars().find(c => c.id === body.carId);
          console.log('CURRENT CAR', currentCar);
          currentCar.comments.push(body.id);
          console.log('comment for recount -->', body);
          if (body.stars > 0) {
            let rat = [];
            for (let c = 0; c < currentCar.comments.length; c++) {
              let coId = currentCar.comments[c];
              console.log('C', c);
              let co = getComments().find(c => c.id === coId);
              rat.push(co.stars);
              console.log('trying to push from comment', co);
              console.log('rat[] is', rat);
              let sum = rat.reduce((a, b) => a + b, 0);
              let newR = Math.round(sum / rat.length);
              currentCar.rating = newR;
              console.log('NEW RATING IS', newR);
              console.log('NOW CAR', currentCar);
            }
          }

          updateCar(currentCar.id, currentCar);
          console.log('CURRENT CAR COMMENTS', currentCar.comments);
          return ok(true);
        case url.endsWith('/users/comments') && method === 'GET':
          return ok(getComments());
        case url.endsWith('users/login') && method === 'POST':
            console.log('fake bakend login');
            const u = getUsers().find(u => u.email === body.email);
            if (u && u.password === body.password) {
              u.token = 'jwt_token';
              return ok(u);
            } else {
              return throwError({status: 401, statusText: 'Unauthorized'});
            }
        case url.substring(0, url.lastIndexOf('/')).endsWith('/car') && method === 'GET':
            const id = parseInt(url.substring(url.lastIndexOf('/') + 1));
            if (id) {
              const car = getCars().find(c => c.id === id);
              if (car) {
                return ok(car);
              } else {
                return throwError({status: 404, statusText: 'Car not found'});
              }
            }
            break;
        case url.substring(0, url.lastIndexOf('/')).endsWith('cars/user') && method === 'GET':
          const userId = parseInt(url.substring(url.lastIndexOf('/') + 1));
          return ok(getCars().filter(c => c.owner_id === userId));
        case  url.endsWith('cars/addcar') && method === 'POST':
          console.log(body);
          if (!body.comments) {
            body.comments = [];
          }
          body.id = getCars().length + 1;
          addCar(body);
          return ok(true);
        case url.endsWith('users/edituser') && method === 'PUT':
            console.log('USER EDIT COME IN', body);
            const us = getUsers().find(us => us.id === body.id);
            if (us) {
              console.log('I TRY TO EDIT UDER:', us);
              us.first_name = body.firstName;
              us.second_name = body.secondName;
              us.email = body.email;
              us.url = body.url;
              if (updateUser(us.id, us)) {
                return ok(true);
              } else {
                return throwError({status: 404, statusText: 'User not found'});
              }
            } else { (console.log('USER NOT FOUND')); }
            break;
        case url.endsWith('cars/editcar') && method === 'PUT':
            console.log(body);
            updateCar(body.id, body);
            return ok(true);
        case url.endsWith('orders/returnorder') && method === 'PUT':
            console.log('order returned -->', body);
            const ord = getOrders().find(o => o.orderId === body.orderId);
            ord.state = State.Returned;
            updateOrder(ord);
            console.log('order after return -->', ord);
            return ok(true);
        case url.endsWith('orders/intermedreturnorder') && method === 'PUT':
          const ordr = getOrders().find(o => o.orderId === body.orderId);
          ordr.state = State.WaitToReturn;
          updateOrder(ordr);
          console.log('order after intermed return -->', ordr);
          return ok(true);
        case url.endsWith('orders/cancelorder') && method === 'PUT':
          const ordC = getOrders().find(o => o.orderId === body.orderId);
          ordC.state = State.Canceled;
          updateOrder(ordC);
          console.log('order after cancel -->', ordC);
          return ok(true);
        case url.endsWith('orders/cancelorderbyowner') && method === 'PUT':
          const ordO = getOrders().find(o => o.orderId === body.orderId);
          ordO.state = State.CanceledByOwner;
          updateOrder(ordO);
          console.log('order after owner cancel -->', ordO);
          return ok(true);
        case url.substring(0, url.lastIndexOf('/')).endsWith('cars/removecar') && method === 'DELETE':
          const carId = parseInt(url.substring(url.lastIndexOf('/') + 1));
          removeCar(carId);
          return ok(true);
        case url.substring(0, url.lastIndexOf('/')).endsWith('users/removeuser') && method === 'DELETE':
          const usId = parseInt(url.substring(url.lastIndexOf('/') + 1));
          console.log('fake delete user');
          const succsess = removeUser(usId);
          return ok(succsess);
          break;
        case url.substring(0, url.lastIndexOf('/')).endsWith('comments') && method === 'GET':
          const commentId = parseInt(url.substring(url.lastIndexOf('/') + 1));
          const res =  getComments().find(c => c.id === commentId);
          console.log('RESULT IS: ', res);
          return ok(res);
        case url.substring(0, url.lastIndexOf('/')).endsWith('orders') && method === 'GET':
          const myId = parseInt(url.substring(url.lastIndexOf('/') + 1));
          const result =  getOrders().filter(o => o.carOwnerId === myId);
          console.log('fake res orders: ', result);
          return ok(result);
        case url.substring(0, url.lastIndexOf('/')).endsWith('orders/lastorder') && method === 'GET':
          const orders =  getOrders();
          const lastres = orders[orders.length - 1];
          console.log('fake last order: ', lastres);
          return ok(lastres);
        case url.substring(0, url.lastIndexOf('/')).endsWith('myorder') && method === 'GET':
          const mId = parseInt(url.substring(url.lastIndexOf('/') + 1));
          const reslt =  getOrders().filter(o => o.renterId === mId);
          console.log('fake res my orders: ', reslt);
          return ok(reslt);
        case url.substring(0, url.lastIndexOf('/')).endsWith('users') && method === 'GET':
          const uId = parseInt(url.substring(url.lastIndexOf('/') + 1));
          const resultat = getUsers().find(u => u.id === uId);
          return ok(resultat);
        case url.substring(0, url.lastIndexOf('/')).endsWith('thiscarorder') && method === 'GET':
          const thisCarId = parseInt(url.substring(url.lastIndexOf('/') + 1));
          const resOrds = getOrders().filter(o => o.carId === thisCarId);
          return ok(resOrds);
        case url.endsWith('cars/topcars') && method === 'GET':
          console.log('topCars fake backend');
          const topCars = getCars().sort((a, b) => b.rating - a.rating).slice(0, 3);
          console.log('top cars', topCars);
          // const topCars = [{ img_url: '../../assets/zaz.jpg', title: 'zaz', price: 230}];
          return ok(topCars);
        case url.endsWith('/orders/addorder') && method === 'POST' :
          body.orderId = getOrders().length + 1;
          const user = getUsers().find(u => u.id === body.carOwnerId);
          if (user) {
            body.carOwnerName = user.first_name + ' ' + user.second_name;
            body.state = State.WaitToGo;
            addOrder(body);
            return ok(true);
          }
      }
      return next.handle(request);
      }

    function authenticate() {
        const {first_name, password} = body;
        const user = getUsers().find(x => x.first_name === first_name && x.password === password);
        if (!user) {
          return error('Username or password is incorrect');
        }
        return ok({
          id: user.id,
          first_name: user.first_name,
          last_name: user.second_name,
          email: user.email,
          token: 'fake-jwt-token'
        });
      }

    function ok(body?) {
        return of(new HttpResponse({status: 200, body}));
      }

    function error(message) {
        return throwError({error: {message}});
      }

    function unauthorized() {
        return throwError({status: 401, error: {message: 'Unauthorised'}});
      }

    function isLoggedIn() {
        return headers.get('Authorization') === 'Bearer fake-jwt-token';
      }
    }
  }

