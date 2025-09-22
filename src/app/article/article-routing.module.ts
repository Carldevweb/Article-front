import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageAllArticleComponent } from './pages/page-all-article/page-all-article.component';
import { PageEditArticleComponent } from './pages/page-edit-article/page-edit-article.component';
import { PageCreateArticleComponent } from './pages/page-create-article/page-create-article.component';
import { PageArticleComponent } from './pages/page-article/page-article.component';

const routes: Routes = [
  { path: '', component: PageAllArticleComponent },
  { path: 'edit-article', component: PageEditArticleComponent },
  { path: 'create-article', component: PageCreateArticleComponent },
  { path: ':id', component: PageArticleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticleRoutingModule {}
