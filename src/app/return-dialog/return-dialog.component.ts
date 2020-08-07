import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Order} from '../rent.service';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {icon, library} from '@fortawesome/fontawesome-svg-core';
import {Comment, UsersService} from '../users.service';
import {NgForm} from '@angular/forms';
import {RentService} from '../rent.service';
import {ToastrService} from 'ngx-toastr';


library.add(faStar);
const star = icon({ prefix: 'fas', iconName: 'star' });

@Component({
  selector: 'app-return-dialog',
  templateUrl: './return-dialog.component.html',
  styleUrls: ['./return-dialog.component.css']
})
export class ReturnDialogComponent implements OnInit {
  order: Order;
  newRating: number;
  stars: number[] = [1, 2 , 3, 4, 5];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ReturnDialogComponent>, private rentService: RentService, private userService: UsersService, private toastr: ToastrService) {
    if (data) {
      this.order = data;
      this.order.dateOn = new Date(`${this.order.dateOn} UTC`);
      this.order.dateOff = new Date(`${this.order.dateOff} UTC`);
      console.log('ORDER HERE IS ', this.order);
  }

}

  ngOnInit() {
    this.newRating = 0;
  }
  onSupport() {
    alert('Support message!');
  }
  onStar(idx) {
    console.log(idx);
    this.newRating = idx;
  }
  onSubmit(commentForm: NgForm) {
    const comment = commentForm.value as Comment;
    console.log('I TRY TO ADD NEW COMMENT:', comment);
    comment.stars = this.newRating;
    comment.name = this.order.renterName;
    comment.url = this.userService.getCurrentUser().url;
    comment.date = new Date();
    comment.carId = this.order.carId;
    console.log('commentForm.value.text', commentForm.value.text);
    if (commentForm.value.text) {
      console.log('new car rating is', commentForm.value.text);
      comment.text = commentForm.value.text;
    } else {
      comment.text = '';
    }
    console.log('comment text', comment.text);
    this.rentService.intermediateReturn(this.order).subscribe(
      res => {
        console.log(res);
        this.dialogRef.close();
        this.showToastr(this.order);
        if (comment.text || comment.stars > 0) {
          this.userService.addComment(comment).subscribe(comRes => {
            if (comRes) {
              console.log('RES', comRes);
            } else  {
              console.log('NOTHING COMES');
            }
          });
        }
      }
    );


  }
  exit() {
    this.dialogRef.close();
  }
  showToastr(order) {
    this.toastr.success('Yor returned car ' + ' ' + order.carName + '. Waiting of car owner(' + order.carOwnerName + ')approving.',  ' ');
  }
}
