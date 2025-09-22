import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { PageSignUpComponent } from './page-sign-up/page-sign-up.component';
import { PageSignInComponent } from './page-sign-in/page-sign-in.component';
import { PageResetPasswordComponent } from './page-reset-password/page-reset-password.component';
import { PageForgotPasswordComponent } from './page-forgot-password/page-forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PageProfilComponent } from './page-profil/page-profil.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    PageSignUpComponent,
    PageSignInComponent,
    PageResetPasswordComponent,
    PageForgotPasswordComponent,
    PageProfilComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    SharedModule
]
})
export class LoginModule { }
