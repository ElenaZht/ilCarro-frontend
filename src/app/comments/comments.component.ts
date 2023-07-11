import {Component, OnDestroy, OnInit} from '@angular/core';
import {Comment, UsersService} from '../users.service';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core';
library.add(faStar);

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit, OnDestroy {
  comments: Comment[] = [];
  private getCommentsSubscription;
  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.getCommentsSubscription = this.usersService.getComments().subscribe(res => {
      // @ts-ignore
      this.comments = res.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);


  });

  }
  ngOnDestroy(): void {
    this.getCommentsSubscription.unsubscribe();
  }
}
