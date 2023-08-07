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
import {RoutingModule} from './routing/routing.module';
import {LoginComponent} from './login/login.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from './helpers/jwt.interceptor';
import {FakeBackendInterceptor} from './helpers/fake-backend';
import {ToastrModule} from 'ngx-toastr';
import {FooterModule} from './carro-footer/footer/footer.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import { TermsComponent } from './terms/terms.component';
import { UserPageComponent } from './user-page/user-page.component';
import { LetTheCarWorkComponent } from './let-the-car-work/let-the-car-work.component';
import { CarComponent } from './car/car.component';
import { AddCarComponent } from './add-car/add-car.component';
import { StarRatingModule } from 'angular-star-rating';
import {
  MatButtonToggleModule,
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatSliderModule,
  MatTabsModule
} from '@angular/material';
import {MatDividerModule} from '@angular/material/divider';
import {AgmCoreModule} from '@agm/core';
import { RentFormComponent } from './rent-form/rent-form.component';
import {RentService} from './rent.service';
import {MockRentService} from './mock-rent.service';
import {MAT_DATE_LOCALE} from '@angular/material';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { ReturnDialogComponent } from './return-dialog/return-dialog.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { LoginOrSignDialogComponent } from './login-or-sign-dialog/login-or-sign-dialog.component';
import { SearchComponent } from './search/search.component';
import {SearchMockService} from './search-mock.service';
import {SearchService} from './search.service';
import { CarWindowComponent } from './car-window/car-window.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SignUpComponent,
    PopularCarsComponent,
    CommentsComponent,
    SingUpDialogComponent,
    NavbarComponent,
    LoginComponent,
    TermsComponent,
    UserPageComponent,
    LetTheCarWorkComponent,
    CarComponent,
    AddCarComponent,
    RentFormComponent,
    PaymentDialogComponent,
    ReturnDialogComponent,
    LoginOrSignDialogComponent,
    SearchComponent,
    CarWindowComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    RoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({timeOut: 8000, positionClass: 'toast-top-right'}),
    FooterModule,
    FontAwesomeModule,
    StarRatingModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatTabsModule,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyCjZpKwxl9P88Y2kGDyTKkkLmS-IMxT8eY'
      }
    ),
    MatInputModule,
    MatSliderModule
  ],
  providers: [
    {provide: UsersService, useClass: UsersArrayService},
    {provide: SearchService, useClass: SearchMockService},
    {provide: CarsService, useClass: MockCarsService},
    {provide: RentService, useClass: MockRentService},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true},
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},

  ],
  entryComponents: [SingUpDialogComponent, LoginComponent,
    PaymentDialogComponent, ReturnDialogComponent, LoginOrSignDialogComponent, CarWindowComponent],

  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(fab);
  }
}

