import { Component, OnInit } from '@angular/core';
import {Comment, UsersService} from '../users.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.getComments().subscribe(res => {
      this.comments = res.slice(0, 6);
      console.log(res.slice(0, 6));
   });
  }

}
