import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { PageCreateCategoryComponent } from './page-create-category/page-create-category.component';
import { PageListCategoryComponent } from './page-list-category/page-list-category.component';


@NgModule({
  declarations: [
    PageCreateCategoryComponent,
    PageListCategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule
  ]
})
export class CategoryModule { }
