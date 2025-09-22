import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { PageCreateMediaComponent } from './page-create-media/page-create-media.component';
import { PageUpdateMediaComponent } from './page-update-media/page-update-media.component';


@NgModule({
  declarations: [
    PageCreateMediaComponent,
    PageUpdateMediaComponent
  ],
  imports: [
    CommonModule,
    MediaRoutingModule
  ]
})
export class MediaModule { }
