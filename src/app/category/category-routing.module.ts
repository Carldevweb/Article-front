import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageListCategoryComponent } from './page-list-category/page-list-category.component';
import { PageCreateCategoryComponent } from './page-create-category/page-create-category.component';
import { RoleGuard } from '../guards/role.guard'; // ajuste le chemin si besoin
import { PageArticlesByCategoryComponent } from '../article/pages/page-articles-by-category-component/page-articles-by-category-component.component';
import { PageEditCategoryComponent } from './page-edit-category/page-edit-category.component';

const routes: Routes = [
  { path: '', component: PageListCategoryComponent },
  {
    path: 'create-category',
    component: PageCreateCategoryComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] },
  },

  {
    path: ':id/edit',
    component: PageEditCategoryComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] },
  },

  { path: ':id/articles', component: PageArticlesByCategoryComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule { }
