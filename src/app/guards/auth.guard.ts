import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // Pas connecté => login
    if (!this.auth.isAuthenticated()) {
      return this.router.parseUrl('/login');
    }

    // Pas admin => retour home
    if (this.auth.getRole() !== 'ADMIN') {
      return this.router.parseUrl('/articles');
    }

    return true;
  }
}
