import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableLightComponent } from './components/table-light/table-light.component';
import { BtnComponent } from './components/btn/btn.component';
import { TemplateFullWidthComponent } from './template-full-width/template-full-width.component';
import { TemplateFullContainerComponent } from './template-full-container/template-full-container.component';
import { FormCustomComponent } from './form-custom/form-custom.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardCustomComponent } from './card-custom/card-custom/card-custom.component';
import { ArticleCustomComponent } from './article-custom/article-custom/article-custom.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TableLightComponent,
    BtnComponent,
    TemplateFullWidthComponent,
    TemplateFullContainerComponent,
    FormCustomComponent,
    CardCustomComponent,
    ArticleCustomComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    TableLightComponent,
    BtnComponent,
    TemplateFullWidthComponent,
    TemplateFullContainerComponent,
    FormCustomComponent,
    CardCustomComponent,
    ArticleCustomComponent,
  ],
})
export class SharedModule {}
