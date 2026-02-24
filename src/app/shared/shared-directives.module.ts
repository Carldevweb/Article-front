import { NgModule } from '@angular/core';
import { HasRoleDirective } from './directives/has-role.directive';

@NgModule({
  imports: [HasRoleDirective],
  exports: [HasRoleDirective],
})
export class SharedDirectivesModule {}
