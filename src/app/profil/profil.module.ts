import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilRoutingModule } from './profil-routing.module';
import { PageProfilComponent } from './page-profil/page-profil.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PageProfilComponent,
    
  ],
  imports: [
    CommonModule,
    ProfilRoutingModule,
    SharedModule,
  ]
})
export class ProfilModule { }
