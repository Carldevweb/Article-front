import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UiModule } from '../ui/ui.module';
import { IconsModule } from '../icons/icons.module';

import { NavComponent } from './component/nav/nav.component';
import { FooterComponent } from './component/footer/footer.component';


import { SharedDirectivesModule } from '../shared/shared-directives.module'; 

@NgModule({
  declarations: [
    NavComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    UiModule,
    IconsModule,
    SharedDirectivesModule,
  ],
  exports: [
    NavComponent,
    FooterComponent,
    UiModule,
    IconsModule,
  ],
})
export class CoreModule {}
