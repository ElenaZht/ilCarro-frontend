import { Component, OnInit } from '@angular/core';
import {User, UsersService} from '../users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Car, CarsService} from '../cars.service';
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

library.add(faPen);
library.add(faTrash);

const pen = icon({ prefix: 'fas', iconName: 'pen' });
const trash = icon({ prefix: 'fas', iconName: 'trash' });


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  user: User ;
  cars: Array<Car>;


  constructor(private usersService: UsersService,  private router: Router, private carsService: CarsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.usersService.getCurrentUser();
    console.log(this.user);
    this.carsService.getCarByUserId(this.user.id).subscribe(res => {
      this.cars = res;
    }, error => console.log(error));
  }

  toCar(id) {
    this.router.navigate(['/car', id]);

  }
}
