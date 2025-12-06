import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { PageCreateCategoryComponent } from './page-create-category/page-create-category.component';
import { PageListCategoryComponent } from './page-list-category/page-list-category.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    PageCreateCategoryComponent,
    PageListCategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule
]
})
export class CategoryModule { }
