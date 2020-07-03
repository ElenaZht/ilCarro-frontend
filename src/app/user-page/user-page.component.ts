import { Component, OnInit } from '@angular/core';
import {User, UsersService} from '../users.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  user: User ;

  constructor(private usersService: UsersService,  private router: Router) { }

  ngOnInit() {
    this.user = this.usersService.getCurrentUser();
    console.log(this.user);
  }

  toCar() {
    this.router.navigate(['/car']);

  }
}
