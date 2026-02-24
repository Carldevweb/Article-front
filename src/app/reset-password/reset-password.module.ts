import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { PageResetPasswordComponent } from './reset-password/page-reset-password/page-reset-password.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PageResetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ResetPasswordRoutingModule
  ]
})
export class ResetPasswordModule { }
