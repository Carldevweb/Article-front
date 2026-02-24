import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageUpdateMediaComponent } from './page-update-media/page-update-media.component';
import { RoleGuard } from '../guards/role.guard';

const routes: Routes = [

  {
    path: 'update-media',
    component: PageUpdateMediaComponent,
    canActivate: [RoleGuard],
    data: { roles: ['EMPLOYEE', 'ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaRoutingModule { }
