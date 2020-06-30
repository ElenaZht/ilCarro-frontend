import { Component, OnInit } from '@angular/core';
import {fab} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  icon = fab;
  logo = '../assets/img/logo.svg';
  constructor() { }

  ngOnInit() {
  }

}
