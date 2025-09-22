import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRoutingModule } from './article-routing.module';
import { PageEditArticleComponent } from './pages/page-edit-article/page-edit-article.component';
import { PageAllArticleComponent } from './pages/page-all-article/page-all-article.component';
import { PageCreateArticleComponent } from './pages/page-create-article/page-create-article.component';
import { SharedModule } from '../shared/shared.module';
import { PageArticleComponent } from './pages/page-article/page-article.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    PageEditArticleComponent,
    PageAllArticleComponent,
    PageCreateArticleComponent,
    PageArticleComponent,
  ],
  imports: [CommonModule, ArticleRoutingModule, SharedModule, HttpClientModule],

  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ArticleModule {}
