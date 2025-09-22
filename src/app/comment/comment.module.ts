import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentRoutingModule } from './comment-routing.module';
import { PageCreateCommentComponent } from './page-create-comment/page-create-comment.component';


@NgModule({
  declarations: [
    PageCreateCommentComponent
  ],
  imports: [
    CommonModule,
    CommentRoutingModule
  ]
})
export class CommentModule { }
