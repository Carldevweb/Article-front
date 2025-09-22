import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageCreateCommentComponent } from './page-create-comment/page-create-comment.component';

const routes: Routes = [{ path: '', component: PageCreateCommentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommentRoutingModule {}
