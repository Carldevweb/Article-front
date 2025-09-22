import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { PageUpdateUserComponent } from './page-update-user/page-update-user.component';
import { PageCreateUserComponent } from './page-create-user/page-create-user.component';
import { PageUserProfilComponent } from './page-user-profil/user-profil.component';


@NgModule({
  declarations: [
    PageUpdateUserComponent,
    PageCreateUserComponent,
    PageUserProfilComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
