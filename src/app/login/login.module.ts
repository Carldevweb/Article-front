import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { PageSignUpComponent } from './page-sign-up/page-sign-up.component';
import { PageSignInComponent } from './page-sign-in/page-sign-in.component';
import { PageForgotPasswordComponent } from './page-forgot-password/page-forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    PageSignUpComponent,
    PageSignInComponent,
    PageForgotPasswordComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LoginModule { }
