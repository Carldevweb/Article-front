// src/app/shared/directives/has-role.directive.ts
import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthFacade } from '../../core/auth/auth.facade';
import { Role } from '../../core/auth/role.type';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnDestroy {
  private sub?: Subscription;

  private thenTpl: TemplateRef<unknown>;
  private elseTpl?: TemplateRef<unknown>;

  private hasView = false;
  private allowed: Role[] = [];

  constructor(
    thenTpl: TemplateRef<unknown>,
    private vcr: ViewContainerRef,
    private auth: AuthFacade
  ) {
    this.thenTpl = thenTpl;
  }

  @Input()
  set appHasRole(value: Role[] | Role) {
    this.allowed = Array.isArray(value) ? value : [value];
    this.bind();
  }
  
  @Input()
  set appHasRoleElse(templateRef: TemplateRef<unknown> | null) {
    this.elseTpl = templateRef ?? undefined;
    this.bind();
  }

  private bind() {
    if (!this.allowed.length) return;

    this.sub?.unsubscribe();
    this.sub = this.auth.hasRole$(...this.allowed).subscribe((can: boolean) => {
      this.vcr.clear();
      if (can) {
        this.vcr.createEmbeddedView(this.thenTpl);
      } else if (this.elseTpl) {
        this.vcr.createEmbeddedView(this.elseTpl);
      }
      this.hasView = can;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
