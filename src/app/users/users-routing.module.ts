import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageUserProfilComponent } from './page-user-profil/user-profil.component';
import { PageUpdateUserComponent } from './page-update-user/page-update-user.component';
import { PageCreateUserComponent } from './page-create-user/page-create-user.component';

const routes: Routes = [
  { path: '', component: PageUserProfilComponent },
  { path: 'user-update', component: PageUpdateUserComponent },
  { path: 'user-create', component: PageCreateUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
