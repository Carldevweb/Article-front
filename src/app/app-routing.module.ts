import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/articles', pathMatch: 'full' },

  {
    path: 'articles',
    loadChildren: () =>
      import('./article/article.module').then((m) => m.ArticleModule),
  },

  {
    path: 'categories',
    loadChildren: () =>
      import('./category/category.module').then((m) => m.CategoryModule),
  },

  {
    path: 'media',
    loadChildren: () =>
      import('./media/media.module').then((m) => m.MediaModule),
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./page-not-found/page-not-found.module').then(
        (m) => m.PageNotFoundModule
      ),
  },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
