import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {UsersService} from './users.service';
import {UsersArrayService} from './users-array.service';
import {FormsModule} from '@angular/forms';
import { HomePageComponent } from './home-page/home-page.component';
import { PopularCarsComponent } from './popular-cars/popular-cars.component';
import { CommentsComponent } from './comments/comments.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatDialogModule} from '@angular/material/dialog';
import { SingUpDialogComponent } from './sing-up-dialog/sing-up-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SignUpComponent,
    PopularCarsComponent,
    CommentsComponent,
    SingUpDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [
    {provide: UsersService, useClass: UsersArrayService}
  ],
  entryComponents: [SingUpDialogComponent],

  bootstrap: [AppComponent]
})
export class AppModule { }
