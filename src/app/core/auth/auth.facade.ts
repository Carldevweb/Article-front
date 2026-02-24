// src/app/core/auth/auth.facade.ts
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Role } from './role.type';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

export interface CurrentUser {
  id: number;
  email: string;
  role?: Role;
  roles?: Role[];
}

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  readonly user$: Observable<CurrentUser | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$.pipe(
      map((u: User | null) => {
        if (!u) return null;

        let role = String((u as any)?.role ?? this.authService.getRole() ?? '')
          .toUpperCase()
          .trim();
        if (role.startsWith('ROLE_')) role = role.substring(5);

        const normalized: Role | undefined =
          role === 'USER' || role === 'EMPLOYEE' || role === 'ADMIN'
            ? (role as Role)
            : undefined;

        return {
          id: (u as any).id,
          email: (u as any).email,
          role: normalized,
        };
      })
    );
  }

  private toRoles(u: CurrentUser | null): Role[] {
    if (!u) return [];
    if (Array.isArray(u.roles) && u.roles.length) return u.roles;
    if (u.role) return [u.role];
    return [];
  }

  hasRole$(...allowed: Role[]): Observable<boolean> {
    return this.user$.pipe(
      map(u => {
        const roles = this.toRoles(u);
        return allowed.some(r => roles.includes(r));
      })
    );
  }
}
