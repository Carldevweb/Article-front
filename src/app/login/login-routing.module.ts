import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageSignInComponent } from './page-sign-in/page-sign-in.component';
import { PageSignUpComponent } from './page-sign-up/page-sign-up.component';
import { PageForgotPasswordComponent } from './page-forgot-password/page-forgot-password.component';
import { PageProfilComponent } from './page-profil/page-profil.component';

const routes: Routes = [
  { path: '', component: PageSignInComponent },
  { path: 'sign-up', component: PageSignUpComponent },
  { path: 'profil', component: PageProfilComponent },
  { path: 'forgot', component: PageForgotPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
