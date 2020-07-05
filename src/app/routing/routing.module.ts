import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { HomePageComponent } from '../home-page/home-page.component';
import {RouterModule, Routes} from '@angular/router';
import {EmptyPageComponent} from '../empty-page/empty-page.component';
import {LoginComponent} from '../login/login.component';
import {AuthGuard} from '../helpers/auth.guard';
import {TermsComponent} from '../terms/terms.component';
import {UserPageComponent} from '../user-page/user-page.component';
import {LetTheCarWorkComponent} from '../let-the-car-work/let-the-car-work.component';
import {CarComponent} from '../car/car.component';

const routes: Routes = [
  { path: 'homepage', component: HomePageComponent },
  {path: 'terms', component: TermsComponent},
  {path: 'myaccount', component: UserPageComponent},
  {path: 'letthecarwork', component: LetTheCarWorkComponent},
  { path: 'signup', component: SignUpComponent },
  { path: 'car/:id', component: CarComponent},
  { path: 'signupwind', component: EmptyPageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'loginwind', component: EmptyPageComponent},
  {path: 'logout', component: EmptyPageComponent, canActivate: [AuthGuard], children: []},
  {path: '**', redirectTo: 'homepage' }
    ];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(
      routes,
      {
        enableTracing: false, // <-- debugging purposes only
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
