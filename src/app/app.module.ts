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

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SignUpComponent,
    PopularCarsComponent,
    CommentsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    {provide: UsersService, useClass: UsersArrayService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
