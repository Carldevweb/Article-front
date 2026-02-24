import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      return this.router.parseUrl('/login');
    }

    const roles = route.data['roles'] as Array<'USER' | 'EMPLOYEE' | 'ADMIN'> | undefined;

    if (roles && !this.auth.hasAnyRole(roles)) {
      return this.router.parseUrl('/articles');
    }

    return true;
  }
}
