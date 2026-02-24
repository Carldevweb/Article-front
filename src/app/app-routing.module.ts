import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PublicGuard } from './guards/public.guard';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './guards/auth.guard';

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
    canActivate: [PublicGuard],
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },

 {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
  },

  {
    path: 'profil',
    loadChildren: () =>
      import('./profil/profil.module').then((m) => m.ProfilModule),
  },


  {
    path: 'reset-password',
    loadChildren: () =>
      import('./reset-password/reset-password.module').then((m) => m.ResetPasswordModule),
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
export class AppRoutingModule { }
