import { Component, OnInit } from '@angular/core';
import {Car} from '../cars.service';
import {Filter, SearchService} from '../search.service';
import {Router} from '@angular/router';
import {icon, library} from '@fortawesome/fontawesome-svg-core';
import {faArrowDown, faMapMarkerAlt, faTools} from '@fortawesome/free-solid-svg-icons';
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch';
import {MatDialog} from '@angular/material';
import {CarWindowComponent} from '../car-window/car-window.component';

library.add(faTools);
library.add(faMapMarkerAlt);
library.add(faSearch);
library.add(faArrowDown);

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  today = new Date();
  allCars: Car[];
  lat: number;
  lng: number;
  stars: number[] = [1, 2 , 3, 4, 5];
  dateOn: Date;
  dateOff: Date;
  gear: string;
  year: string;
  class: string;
  newRating: number;
  city: string;
  rad: number;
  cities: string[] = [
    'Tel Aviv', 'Ramat Gan', 'Holon', 'Bat Yam', 'Jerusalim'
  ];
  priceval: number;
  filter: Filter = {
    price: 0,
    rating: 0,
    dateOn: this.today,
    dateOff: this.today,
    features: {
      multimediaDisplay: false,
      abs: false,
      climatControl: false,
      childAutoseat: false
    },
    gear: '',
    year: 0,
    class: '',
    location: {
      country: '',
      city: '',
      street: '',
      region: '',
      zip: 0,
      lat: 0,
      lng: 0,
    },
    city: '',
    rad: 0
  };



  constructor(private searchService: SearchService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.lat = 32.0804808;
    this.lng = 34.7805274;
    this.searchService.getAllCars().subscribe(
      res => {
        if (res) {
          console.log(res);
          this.allCars = res;
        }
      }, error => {
        console.log(error);
      }
    );

  }
  toCar(id) {
    const dialogRef = this.dialog.open(CarWindowComponent, {panelClass: 'custom-dialog-container' , data: id});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The car window dialog was closed', result);
    });
  }
  onChosenLocation(event) {
    console.log(event);
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }
  onStar(idx) {
    console.log(idx);
    this.newRating = idx;
  }
  onClear1() {
    this.priceval = 0;
    this.newRating = 0;
    this.dateOn = undefined;
    this.dateOff = undefined;
  }
  onClear2() {
    this.filter.features.multimediaDisplay = false;
    this.filter.features.abs = false;
    this.filter.features.climatControl = false;
    this.filter.features.childAutoseat = false;
    this.gear = '';
    this.year = '';
    this.class = '';
  }
  onClear3() {
    this.city = '';
    this.lat = 0;
    this.lng = 0;
    this.rad = 0;
  }
  onSubmit(filter: Filter) {
    console.log('gear is', this.gear);
    filter.rating = this.newRating;
    filter.price = this.priceval;
    filter.dateOn = this.dateOn;
    filter.dateOff = this.dateOff;
    filter.gear = this.gear;
    filter.year = parseInt(this.year);
    filter.class = this.class;
    filter.city = this.city;
    filter.location.lat = this.lat;
    filter.location.lng = this.lng;
    filter.rad = this.rad;
    filter.features.multimediaDisplay = this.filter.features.multimediaDisplay;
    filter.features.abs = this.filter.features.abs;
    filter.features.climatControl = this.filter.features.climatControl;
    filter.features.childAutoseat = this.filter.features.childAutoseat;
    this.searchService.getCarsByFilter(filter).subscribe(
      res => {
        console.log(res);
        this.allCars = res;
      }
    );
  }
}
