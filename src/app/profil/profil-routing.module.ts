import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageProfilComponent } from './page-profil/page-profil.component';
import { RoleGuard } from '../guards/role.guard';

const routes: Routes = [
  { path: '', component: PageProfilComponent, canActivate: [RoleGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilRoutingModule { }
