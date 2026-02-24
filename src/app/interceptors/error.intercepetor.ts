import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log minimal (à garder ou enlever)
        console.error('Erreur HTTP', {
          url: req.url,
          status: error.status,
          message: error.message,
          error: error.error,
        });

        // ⚠️ Ne PAS gérer le 401 ici : AuthInterceptor s'en charge (refresh + retry)
        return throwError(() => error);
      })
    );
  }
}
