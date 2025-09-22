import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageCreateMediaComponent } from './page-create-media/page-create-media.component';
import { PageUpdateMediaComponent } from './page-update-media/page-update-media.component';

const routes: Routes = [
  { path: '', component: PageCreateMediaComponent },
  { path: 'update-media', component: PageUpdateMediaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaRoutingModule {}
