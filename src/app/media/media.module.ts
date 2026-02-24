import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { PageUpdateMediaComponent } from './page-update-media/page-update-media.component';

@NgModule({
  declarations: [
    PageUpdateMediaComponent
  ],
  imports: [
    CommonModule,
    MediaRoutingModule
  ]
})
export class MediaModule { }
