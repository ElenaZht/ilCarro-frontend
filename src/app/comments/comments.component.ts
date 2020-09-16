import { Component, OnInit } from '@angular/core';
import {Comment, UsersService} from '../users.service';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {icon, library} from '@fortawesome/fontawesome-svg-core';


library.add(faStar);
const star = icon({ prefix: 'fas', iconName: 'star' });

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.getComments().subscribe(res => {
      // @ts-ignore
      this.comments = res.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
      console.log('home page comments', this.comments);


  });

}}
