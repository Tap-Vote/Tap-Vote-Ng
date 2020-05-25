// src/app/token.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { AuthService } from 'src/app/auth.service';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.jwt()}`
      }
    });
    return next.handle(request).pipe(
      tap((_event) => {}),
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          const status = error.status;
          if (status >= 400 && status < 500) {
            this.authService.logout();
          }
        }
        return throwError(error);
      })
    );
  }
}
