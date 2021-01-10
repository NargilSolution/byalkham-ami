import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { RegisterComponent } from './auth/register/register.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';

const routes: Routes = [
  // { path: '', component: WelcomeComponent },
  { path: '', component: UserProfileComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
