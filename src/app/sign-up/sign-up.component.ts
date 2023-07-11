import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {User, UsersService} from '../users.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  @Output() signUpResult = new EventEmitter<boolean>();
  checkboxError: boolean;
  errorText: string;
  private subscription: any;

  constructor(private usersService: UsersService) {}
  ngOnInit() {}

  onSubmit(signUpForm: NgForm) {
    this.checkboxError = !signUpForm.value.check ;
    if (this.checkboxError) {
      return;
    }
    const user = signUpForm.value as User;
    this.subscription = this.usersService.AddUser(user)
      .subscribe(res => {
        if (res) {
          signUpForm.reset();
          this.errorText = '';
          this.signUpResult.emit(true);
        }
      }, err => {
        this.errorText = err.statusText;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}



