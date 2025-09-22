import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageListCategoryComponent } from './page-list-category/page-list-category.component';
import { PageCreateCategoryComponent } from './page-create-category/page-create-category.component';

const routes: Routes = [
  { path: '', component: PageListCategoryComponent },
  { path: 'create-category', component: PageCreateCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
