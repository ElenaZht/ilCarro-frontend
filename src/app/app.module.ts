import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {UsersService} from './users.service';
import {UsersArrayService} from './users-array.service';
import {FormsModule} from '@angular/forms';




@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent
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
