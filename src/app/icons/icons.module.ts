import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconLikeComponent } from './icon-like/icon-like.component';
import { IconUserComponent } from './icon-user/icon-user.component';



@NgModule({
  declarations: [
    IconLikeComponent,
    IconUserComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IconLikeComponent,
    IconUserComponent
  ]
})
export class IconsModule { }
