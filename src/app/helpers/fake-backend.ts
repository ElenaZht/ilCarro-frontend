import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';
import {User} from '../users.service';
import {Injectable, OnInit} from '@angular/core';
import {Car} from '../cars.service';
import {Order, State} from '../rent.service';

const usersUnit: User[] = [
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
const carsInit: Car[] = [
  { id: 100, img_url: '../../assets/nissan.jpg', title: 'nissan', model: 'Qashqai',  price: 200, owner_id: 121, year: 2010, location: {country: 'Israel', city: 'Ramat Gan', region: 'Gush dan', street: 'Hayatsyra, 4', zip: 394053, lat: 32.083333, lng: 34.8166634}, engine: '3.0L V6 DOHC',
    fuel: 'Gas', gear: 'Automatic', fuel_cons: '12l', wd: 'RWD', hp: 250, torque: 330, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features: {multimediaDisplay: false, abs: false, climatControl: false, childAutoseat: false},
    rating: 4, comments: [1000, 1001, 1002]},
  { id: 101, img_url: '../../assets/zaz.jpg', title: 'ZAZ', model: '200',  price: 180, owner_id: 121, year: 2008,  location: {country: 'Israel', city: 'Lod', region: 'Gush dan', street: 'Haaron Lublin, 6', zip: 394053, lat: 31.9467, lng: 34.8903}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Mehanic', fuel_cons: '101', wd: 'RWD', hp: 200, torque: 330, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features: {multimediaDisplay: true, abs: true, climatControl: true, childAutoseat: false},
    rating: 3, comments: [1003, 1004, 1005]},
  { id: 102, img_url: '../../assets/mazda.jpg', title: 'mazda', model: '2',  price: 170, owner_id: 120, year: 1999,  location: {country: 'Israel', city: 'Haifa', region: 'Mahoz Haifa', street: 'HaTsvi, 10', zip: 394053, lat: 32.81841, lng:  34.9885}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'CVT', fuel_cons: '80', wd: 'RWD', hp: 180, torque: 300, doors: 4, seats: 5, class: 'C', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features: {multimediaDisplay: false, abs: false, climatControl: false, childAutoseat: true},
    rating: 5, comments: [1006, 1007, 1008]},
  { id: 103, img_url: '../../assets/bmv.jpg', title: 'BMV', model: 'x6', price: 200, owner_id: 122, year: 2018, location: {country: 'Israel', city: 'Holon', region: 'Gush Dan', street: 'Ulitsa HaBika, 9', zip: 394883, lat: 32.0193121, lng: 34.7804076}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Semi-automatic', fuel_cons: '150', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
    features: {multimediaDisplay: true, abs: true, climatControl: true, childAutoseat: false},
    rating: 5, comments: [1009, 1010, 1011]},
  { id: 104, img_url: '../../assets/ford_fiesta.jpg', title: 'Ford', model: 'Fiesta', price: 190, owner_id: 122, year: 2017, location: {country: 'Israel', city: 'Ramat Gan', region: 'Gush Dan', street: 'Ulitsa Lechi, 14', zip: 394883, lat: 32.0686867, lng: 34.8246812}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Semi-automatic', fuel_cons: '150', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'A', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
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
  { id: 107, img_url: '../../assets/kia.jpg', title: 'Kia', model: '', price: 300, owner_id: 123, year: 2020, location: {country: 'Israel', city: 'Holon', region: 'Gush Dan', street: 'Ulitsa Perez, 12', zip: 394883, lat: 32.0193121, lng: 34.7804076}, engine: '3.0L V6 DOHC',
    fuel: 'Benzin', gear: 'Semi-automatic', fuel_cons: '180', wd: 'RWD', hp: 250, torque: 400, doors: 4, seats: 5, class: 'B', about_text: 'BRAND NEW FULLY LOADED CUSTOM 2018 RANGE ROVER HSE with a 3.0 Liter Supercharged V6 Engine. The Range Rover HSE has a 380 horsepower V6, 8-Speed automatic transmission with gearshift paddles, all wheel drive, sliding panoramic roof, Bluetooth and USB.',
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
const commentsInit = [
                { id: 1000,
                  url: '../../assets/face1.jpg',
                  name: 'Haim',
                  date: '22 september 2019',
                  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. ',
                  carId: 100,
                  stars: 4
                },
                  { id: 1001,
                    url: '../../assets/face2.jpg',
                    name: 'Isak',
                    date: '12 december 2020',
                    text: 'Ut enim ad minim veniam, quis nostrud exercitation .',
                    carId: 100,
                    stars: 5

                  },
                  {  id: 1002,
                    url: '../../assets/face3.jpg',
                    name: 'Ori',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .',
                    carId: 100,
                    stars: 5
                  },
                  {  id: 1003,
                    url: '../../assets/face4.jpg',
                    name: 'Lena',
                    date: '5 april 2020',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.',
                    carId: 101,
                    stars: 3

                  },
                  {id: 1004,
                    url: '../../assets/face5.jpg',
                    name: 'Ofira',
                    date: '3 november 2020',
                    text: 'Quisque non tellus orci ac.',
                    carId: 101,
                    stars: 2
                  },
                  {  id: 1008,
                    url: '../../assets/face6.jpg',
                    name: 'Gal',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .',
                    carId: 102,
                    stars: 5
                  },
                  {id: 1010,
                    url: '../../assets/face5.jpg',
                    name: 'Lena',
                    date: '20 may 2019',
                    text: 'Quisque non tellus orci ac.',
                    carId: 103,
                    stars: 5
                  },
                  {  id: 1014,
                    url: '../../assets/face3.jpg',
                    name: 'Ofir',
                    date: '3 july 2019',
                    text: ' Duis aute irure dolor in reprehenderit .',
                    carId: 104,
                    stars: 3
                  },
                  { id: 1019,
                    url: '../../assets/face2.jpg',
                    name: 'Isak',
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
                  {  id: 1023,
                    url: '../../assets/face6.jpeg',
                    name: 'Haim',
                    date: '15 september 2018',
                    text: 'Ornare massa eget  in nisl nisi. Dictum non consectetur a erat nam at lectus.',
                    carId: 107,
                    stars: 5
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
                    name: 'Lena',
                    date: '5 april 2019',
                    text: 'Excepteur sint occaecat cupidatat non proident, sunt id est laborum.',
                    carId: 109,
                    stars: 4
                  }
                  ];
const ordersInit: Order[] = [
  {
    orderId: 0,
    carId: 100,
    carName: 'AZLK',
    carUrl: '../../assets/nissan.jpg',
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
    carUrl: '../../assets/nissan.jpg',
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
    carName: 'Toyota',
    carUrl: '../../assets/toyota.jpg',
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
    state: State.WaitToGo

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
    carName: 'Kia',
    carUrl: '../../assets/kia.jpg',
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

function calculate_distance(lat1 , lon1 , lat2, lon2) {
  const R = 6371e3; // metres
  const phi1 = lat1 * Math.PI / 180; // φ, λ in radians
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaGamma = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaGamma / 2 ) * Math.sin(deltaGamma / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return  R * c; // in metres
}

function checkBusyDates(cId, date1, date2) {
  const busy = [];
  const orders = getOrders().filter(o => o.carId === cId);
  for (const or of orders) {
    busy.push({start: new Date(`${or.dateOn} UTC`).setHours(0, 0, 0, 0),
            end: new Date(`${or.dateOff} UTC`).setHours(0, 0, 0, 0)});
  }
  const found = busy.find(el => el.start <=  date2 && date1 <= el.end);
  return !found;

}

function getCars() {
  return  JSON.parse(localStorage.getItem('cars'));
}

function addCar(car) {
  const cars = getCars();
  cars.push(car);
  localStorage.setItem('cars', JSON.stringify(cars));
}

function updateCar(carID, newValue) {
  const cars = getCars();
  const idx = cars.findIndex(c => c.id === carID);
  cars[idx] = newValue;
  localStorage.setItem('cars', JSON.stringify(cars));

}
function removeCar(carID) {
  const cars = getCars();
  const i = cars.findIndex(car => car.id === carID);
  cars.splice(i, 1);
  localStorage.setItem('cars', JSON.stringify(cars));
}
function getUsers() {
  return  JSON.parse(localStorage.getItem('users'));
}
function updateUser(userID, newValue) {
  const users = getUsers();
  const idx = users.findIndex(c => c.id === userID);
  if (idx > 0) {
    users[idx] = newValue;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }
  return false;
}

function addUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
}
function removeUser(userID) {
  const users = getUsers();
  const i = users.findIndex(car => car.id === userID);
  if (i > 0) {
    users.splice(i, 1);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }
  return false;
}
function getComments() {
  return  JSON.parse(localStorage.getItem('comments'));
}
function addComment(comment) {
  const comments = getComments();
  comments.push(comment);
  localStorage.setItem('comments', JSON.stringify(comments));
}
function getOrders() {
  return  JSON.parse(localStorage.getItem('orders'));
}
function addOrder(order) {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
}
function updateOrder(order) {
  const orders = getOrders();
  const idx = orders.findIndex(c => c.orderId === order.orderId);
  orders[idx] = order;
  localStorage.setItem('orders', JSON.stringify(orders));

}
function filterCars(fprams) {
  let cars = getCars();
  if (fprams.rating) {
    cars = cars.filter(c => c.rating === fprams.rating);
  }
  if (fprams.price && fprams.price !== 0) {
    cars = cars.filter(c => c.price <= fprams.price);
  }
  if (fprams.dateOn && fprams.dateOff) {
    cars = cars.filter(c => checkBusyDates(c.id, fprams.dateOn, fprams.dateOff));
  }
  if (fprams.features.multimediaDisplay) {
    cars = cars.filter(c => c.features.multimediaDisplay === fprams.features.multimediaDisplay);
  }
  if (fprams.features.abs) {
    cars = cars.filter(c => c.features.abs === fprams.features.abs);
  }
  if (fprams.features.climatControl) {
    cars = cars.filter(c => c.features.climatControl === fprams.features.climatControl);
  }
  if (fprams.features.childAutoseat) {
    cars = cars.filter(c => c.features.childAutoseat === fprams.features.childAutoseat);
  }
  if (fprams.gear && fprams.gear !== '') {
    cars = cars.filter(c => c.gear === fprams.gear);
  }
  if (fprams.year) {
    cars = cars.filter(c => c.year === fprams.year);
  }
  if (fprams.class && fprams.class !== '') {
    cars = cars.filter(c => c.class === fprams.class);
  }
  if (fprams.city && fprams.city !== '') {
    cars = cars.filter(c => c.location.city === fprams.city);
  }
  if (fprams.location.lng && fprams.location.lat && fprams.rad) {
    cars = cars.filter(c => calculate_distance(fprams.location.lat, fprams.location.lng, c.location.lat, c.location.lng) <= fprams.rad);
  }
  return cars;
}

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {
    const checkCars = localStorage.getItem('cars');
    if (!checkCars) {
      localStorage.setItem('cars', JSON.stringify(carsInit));
    }
    const checkUsers = localStorage.getItem('users');
    if (!checkUsers) {
      localStorage.setItem('users', JSON.stringify(usersUnit));
    }
    const checkComments = localStorage.getItem('comments');
    if (!checkComments) {
      localStorage.setItem('comments', JSON.stringify(commentsInit));
    }
    const checkOrders = localStorage.getItem('orders');
    if (!checkOrders) {
      localStorage.setItem('orders', JSON.stringify(ordersInit));
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;
    // wrap in delayed observable to simulate server api call todo?
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
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
          currentCar.comments.push(body.id);
          if (body.stars > 0) {
            const rat = [];
            for (const comment of currentCar.comments) {
              const coId = comment;
              const co = getComments().find(c => c.id === coId);
              rat.push(co.stars);
              const sum = rat.reduce((a, b) => a + b, 0);
              currentCar.rating = Math.round(sum / rat.length);
            }
          }

          updateCar(currentCar.id, currentCar);
          return ok(true);
        case url.endsWith('/users/comments') && method === 'GET':
          return ok(getComments());
        case url.endsWith('users/login') && method === 'POST':
            const u = getUsers().find(us => us.email === body.email);
            if (u && u.password === body.password) {
              u.token = 'jwt_token';
              return ok(u);
            } else {
              return throwError({status: 401, statusText: 'Unauthorized'});
            }
        case url.substring(0, url.lastIndexOf('/')).endsWith('/car') && method === 'GET':
            const id = parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
            if (id) {
              const car = getCars().find(c => c.id === id);
              if (car) {
                return ok(car);
              } else {
                return throwError({status: 404, statusText: 'Car not found'});
              }
            }
            break;
        case url.endsWith('/cars/allcars') && method === 'GET':
              const cars = getCars();
              if (cars) {
                return ok(cars);
              } else {
                return throwError({status: 404, statusText: 'Cars not found'});
              }
        case url.endsWith('/cars/filteredcars') && method === 'POST':
          const fprams = body;
          const fcars = filterCars(fprams);
          return ok(fcars);
        case url.substring(0, url.lastIndexOf('/')).endsWith('cars/user') && method === 'GET':
          const userId = parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
          return ok(getCars().filter(c => c.owner_id === userId));
        case  url.endsWith('cars/addcar') && method === 'POST':
          if (!body.comments) {
            body.comments = [];
          }
          body.id = getCars().length + 1;
          addCar(body);
          return ok(true);
        case url.endsWith('users/edituser') && method === 'PUT':
            const us = getUsers().find(us => us.id === body.id);
            if (us) {
              us.first_name = body.firstName;
              us.second_name = body.secondName;
              us.email = body.email;
              us.url = body.url;
              if (updateUser(us.id, us)) {
                return ok(true);
              } else {
                return throwError({status: 404, statusText: 'User not found'});
              }
            }
            break;
        case url.endsWith('cars/editcar') && method === 'PUT':
            updateCar(body.id, body);
            return ok(true);
        case url.endsWith('orders/returnorder') && method === 'PUT':
            const ord = getOrders().find(o => o.orderId === body.orderId);
            ord.state = State.Returned;
            updateOrder(ord);
            return ok(true);
        case url.endsWith('orders/intermedreturnorder') && method === 'PUT':
          const ordr = getOrders().find(o => o.orderId === body.orderId);
          ordr.state = State.WaitToReturn;
          updateOrder(ordr);
          return ok(true);
        case url.endsWith('orders/cancelorder') && method === 'PUT':
          const ordC = getOrders().find(o => o.orderId === body.orderId);
          ordC.state = State.Canceled;
          updateOrder(ordC);
          return ok(true);
        case url.endsWith('orders/cancelorderbyowner') && method === 'PUT':
          const ordO = getOrders().find(o => o.orderId === body.orderId);
          ordO.state = State.CanceledByOwner;
          updateOrder(ordO);
          return ok(true);
        case url.substring(0, url.lastIndexOf('/')).endsWith('cars/removecar') && method === 'DELETE':
          const carId = parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
          removeCar(carId);
          return ok(true);
        case url.substring(0, url.lastIndexOf('/')).endsWith('users/removeuser') && method === 'DELETE':
          const usId = parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
          const succsess = removeUser(usId);
          return ok(succsess);
        case url.substring(0, url.lastIndexOf('/')).endsWith('comments') && method === 'GET':
          const commentId = parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
          const res =  getComments().find(c => c.id === commentId);
          return ok(res);
        case url.substring(0, url.lastIndexOf('/')).endsWith('orders') && method === 'GET':
          const myId = parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
          const result =  getOrders().filter(o => o.carOwnerId === myId);
          return ok(result);
        case url.substring(0, url.lastIndexOf('/')).endsWith('orders/lastorder') && method === 'GET':
          const orders =  getOrders();
          const lastres = orders[orders.length - 1];
          return ok(lastres);
        case url.substring(0, url.lastIndexOf('/')).endsWith('myorder') && method === 'GET':
          const mId = parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
          const reslt =  getOrders().filter(o => o.renterId === mId);
          return ok(reslt);
        case url.substring(0, url.lastIndexOf('/')).endsWith('users') && method === 'GET':
          const uId = parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
          const resultat = getUsers().find(u => u.id === uId);
          return ok(resultat);
        case url.substring(0, url.lastIndexOf('/')).endsWith('thiscarorder') && method === 'GET':
          const thisCarId = parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
          const resOrds = getOrders().filter(o => o.carId === thisCarId);
          return ok(resOrds);
        case url.endsWith('cars/topcars') && method === 'GET':
          const topCars = getCars().sort((a, b) => b.rating - a.rating).slice(0, 3);
          return ok(topCars);
        case url.endsWith('/orders/addorder') && method === 'POST' :
          body.orderId = getOrders().length + 1;
          const user = getUsers().find(u => u.id === body.carOwnerId);
          if (user) {
            body.carOwnerName = user.first_name + ' ' + user.second_name;
            body.state = State.WaitToGo;
            addOrder(body);
            console.log('backend order', body);
            return ok(true);
          }
      }
      return next.handle(request);
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

