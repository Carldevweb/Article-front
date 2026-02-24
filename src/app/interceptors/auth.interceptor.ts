import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private refreshInFlight$: Observable<{ token: string }> | null = null;

  // Endpoints qui ne doivent PAS déclencher refresh/retry
  private readonly AUTH_ENDPOINTS = [
    '/authentification/connexion',
    '/authentification/inscription',
    '/authentification/mot-de-passe-oublie',
    '/authentification/reinitialiser-mot-de-passe',
    '/authentification/reinitialiser-email',
    '/authentification/renouveler-token',
  ];

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.injector.get(AuthService);
    const router = this.injector.get(Router);

    const isAuthEndpoint = this.AUTH_ENDPOINTS.some((u) => req.url.includes(u));

    // 1) Ajout Authorization sur toutes les routes sauf endpoints d'auth
    const token = auth.getToken();
    const reqWithAuth =
      !isAuthEndpoint && token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next.handle(reqWithAuth).pipe(
      catchError((err: unknown) => {
        if (!(err instanceof HttpErrorResponse)) {
          return throwError(() => err);
        }

        // 2) Pas de refresh sur les endpoints d'auth eux-mêmes
        if (isAuthEndpoint) {
          return throwError(() => err);
        }

        // 3) Si pas 401 => on laisse passer
        if (err.status !== 401) {
          return throwError(() => err);
        }

        // 4) Si aucun token => logout direct
        const currentToken = auth.getToken();
        if (!currentToken) {
          auth.logout();
          router.navigate(['/login']);
          return throwError(() => err);
        }

        // 5) Refresh + retry une seule fois (évite boucle infinie)
        //    On marque la requête pour ne pas retenter le refresh si le retry reprend 401.
        if (req.headers.has('X-Retry')) {
          auth.logout();
          router.navigate(['/login']);
          return throwError(() => err);
        }

        // 6) Un seul refresh pour toutes les requêtes concurrentes
        if (!this.refreshInFlight$) {
          this.refreshInFlight$ = auth.renewToken().pipe(
            finalize(() => (this.refreshInFlight$ = null))
          );
        }

        return this.refreshInFlight$.pipe(
          switchMap(() => {
            const newToken = auth.getToken();
            if (!newToken) {
              auth.logout();
              router.navigate(['/login']);
              return throwError(() => err);
            }

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
                'X-Retry': '1',
              },
            });

            return next.handle(retryReq);
          }),
          catchError((refreshErr) => {
            // refresh impossible => token invalide/corrompu => logout
            auth.logout();
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      })
    );
  }
}
