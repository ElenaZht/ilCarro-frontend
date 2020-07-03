import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {UsersService} from './users.service';
import {UsersArrayService} from './users-array.service';
import {FormsModule} from '@angular/forms';
import {HomePageComponent} from './home-page/home-page.component';
import {PopularCarsComponent} from './popular-cars/popular-cars.component';
import {CommentsComponent} from './comments/comments.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatDialogModule} from '@angular/material/dialog';
import {SingUpDialogComponent} from './sing-up-dialog/sing-up-dialog.component';
import {CarsService} from './cars.service';
import {MockCarsService} from './mock-cars.service';
import {NavbarComponent} from './navbar/navbar.component';
import {Router} from '@angular/router';
import {RoutingModule} from './routing/routing.module';
import {EmptyPageComponent} from './empty-page/empty-page.component';
import {LoginComponent} from './login/login.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from './helpers/jwt.interceptor';
import {FakeBackendInterceptor} from './helpers/fake-backend';
import {AuthGuard} from './helpers/auth.guard';
import {ToastrModule} from 'ngx-toastr';
import {FooterModule} from './carro-footer/footer/footer.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import { TermsComponent } from './terms/terms.component';
import { UserPageComponent } from './user-page/user-page.component';
import { LetTheCarWorkComponent } from './let-the-car-work/let-the-car-work.component';
import { CarComponent } from './car/car.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SignUpComponent,
    PopularCarsComponent,
    CommentsComponent,
    SingUpDialogComponent,
    NavbarComponent,
    EmptyPageComponent,
    LoginComponent,
    TermsComponent,
    UserPageComponent,
    LetTheCarWorkComponent,
    CarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    RoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({timeOut: 1000, positionClass: 'toast-top-right'}),
    FooterModule,
    FontAwesomeModule
  ],
  providers: [
    {provide: UsersService, useClass: UsersArrayService},
    {provide: CarsService, useClass: MockCarsService},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true}

  ],
  entryComponents: [SingUpDialogComponent, LoginComponent],

  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router) {
    library.add(fab);
  }
}

