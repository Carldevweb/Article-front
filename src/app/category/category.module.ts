import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { PageCreateCategoryComponent } from './page-create-category/page-create-category.component';
import { PageListCategoryComponent } from './page-list-category/page-list-category.component';
import { SharedModule } from "../shared/shared.module";
import { PageEditCategoryComponent } from './page-edit-category/page-edit-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PageCreateCategoryComponent,
    PageListCategoryComponent,
    PageEditCategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
]
})
export class CategoryModule { }
