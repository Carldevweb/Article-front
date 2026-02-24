import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageResetPasswordComponent } from './reset-password/page-reset-password/page-reset-password.component';

const routes: Routes = [
  { path: '', component: PageResetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetPasswordRoutingModule { }
