import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthIntercepteur implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userJson = localStorage.getItem('utilisateur');

    if (userJson) {
      try {
        const utilisateur = JSON.parse(userJson);
        const token = utilisateur?.token;

        if (token) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(cloned); // Requête modifiée
        }
      } catch (e) {
        console.error(
          "Erreur lors du parsing de l'utilisateur dans AuthIntercepteur:",
          e
        );
      }
    }
    return next.handle(req);
  }

  private decoderJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Erreur lors du décodage du JWT:', e);
      return null;
    }
  }
}
