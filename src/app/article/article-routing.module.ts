import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAllArticleComponent } from './pages/page-all-article/page-all-article.component';
import { PageEditArticleComponent } from './pages/page-edit-article/page-edit-article.component';
import { PageCreateArticleComponent } from './pages/page-create-article/page-create-article.component';
import { PageArticleComponent } from './pages/page-article/page-article.component';
import { RoleGuard } from '../guards/role.guard';
import { PageUpdateMediaComponent } from '../media/page-update-media/page-update-media.component';
const routes: Routes = [
  { path: '', component: PageAllArticleComponent },

  {
    path: 'creer',
    component: PageCreateArticleComponent,
    canActivate: [RoleGuard],
    data: { roles: ['EMPLOYEE', 'ADMIN'] },
  },

  {
    path: ':id/edit',
    component: PageEditArticleComponent,
    canActivate: [RoleGuard],
    data: { roles: ['EMPLOYEE', 'ADMIN'] },
  },

  // ✅ IMPORTANT : doit être AVANT ':id'
  {
    path: ':id/media',
    component: PageUpdateMediaComponent,
    canActivate: [RoleGuard],
    data: { roles: ['EMPLOYEE', 'ADMIN'] },
  },

  { path: ':id', component: PageArticleComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticleRoutingModule { }
