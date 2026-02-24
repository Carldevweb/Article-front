import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRoutingModule } from './article-routing.module';
import { PageAllArticleComponent } from './pages/page-all-article/page-all-article.component';
import { PageCreateArticleComponent } from './pages/page-create-article/page-create-article.component';
import { PageEditArticleComponent } from './pages/page-edit-article/page-edit-article.component'; // ✅ IMPORT MANQUANT
import { SharedModule } from '../shared/shared.module';
import { PageArticleComponent } from './pages/page-article/page-article.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedDirectivesModule } from '../shared/shared-directives.module';
import { PageArticlesByCategoryComponent } from './pages/page-articles-by-category-component/page-articles-by-category-component.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PageAllArticleComponent,
    PageCreateArticleComponent,
    PageArticleComponent,
    PageArticlesByCategoryComponent,
    PageEditArticleComponent,
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    SharedModule,
    HttpClientModule,
    SharedDirectivesModule,
    ReactiveFormsModule,
  ],
})
export class ArticleModule {}
