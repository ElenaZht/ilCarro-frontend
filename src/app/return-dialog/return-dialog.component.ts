import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Order} from '../rent.service';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core';
import {Comment, User, UsersService} from '../users.service';
import {NgForm} from '@angular/forms';
import {RentService} from '../rent.service';
import {ToastrService} from 'ngx-toastr';
library.add(faStar);

@Component({
  selector: 'app-return-dialog',
  templateUrl: './return-dialog.component.html',
  styleUrls: ['./return-dialog.component.css']
})
export class ReturnDialogComponent implements OnInit, OnDestroy {
  order: Order;
  newRating: number;
  stars: number[] = [1, 2 , 3, 4, 5];
  user: User;
  private returnSubscription;
  private addCommentSubscription;
  private returnCarSubscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ReturnDialogComponent>,
              private rentService: RentService, private userService: UsersService, private toastr: ToastrService) {
    if (data) {
      this.order = data.car;
      this.user = data.user;

  }

}

  ngOnInit() {
    this.newRating = 0;
    this.order.dateOn = new Date(this.order.dateOn);
    this.order.dateOff = new Date(this.order.dateOff);
  }
  onSupport() {
    alert('Support message!');
  }
  onStar(idx) {
    this.newRating = idx;
  }
  onSubmit(commentForm: NgForm) {
    const comment = commentForm.value as Comment;
    comment.stars = this.newRating;
    comment.name = this.order.renterName;
    comment.url = this.user.url;
    comment.date = new Date();
    comment.carId = this.order.carId;
    if (commentForm.value.text) {
      comment.text = commentForm.value.text;
    } else {
      comment.text = '';
    }
    this.returnSubscription = this.rentService.intermediateReturn(this.order).subscribe(
      () => {
        this.dialogRef.close();
        this.showToastr(this.order);
        if (comment.text || comment.stars > 0) {
          this.addCommentSubscription = this.userService.addComment(comment).subscribe(comRes => {
            if (comRes) {
            } else  {
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

  returnMyCar() {
    this.returnCarSubscription = this.rentService.returnCar(this.order).subscribe(
      () => {
        this.dialogRef.close();
        this.showToastr(this.order);
      }
    );
  }
  ngOnDestroy(): void {
    this.returnSubscription.unsubscribe();
    this.addCommentSubscription.unsubscribe();
    this.returnCarSubscription.unsubscribe();
  }
}
