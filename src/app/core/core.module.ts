import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '../ui/ui.module';
import { IconsModule } from '../icons/icons.module';
import { HeaderComponent } from './component/header/header.component';
import { NavComponent } from './component/nav/nav.component';
import { FooterComponent } from './component/footer/footer.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent,
    NavComponent,
    FooterComponent
  ],
  imports: [CommonModule,RouterModule],
  exports: [UiModule, IconsModule, HeaderComponent, NavComponent, FooterComponent, ],
})
export class CoreModule {}
