// auth.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { NotificacionService } from './notificacion.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificacionService: NotificacionService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // Manejar el error 403 aquí
         
          this.notificacionService.mostrarNotificacion(
            'No cumple con los permisos necesarios.'
          );
          // Puedes redirigir al usuario a la página de inicio de sesión si es necesario
          // this.router.navigate(['/login']);
        } else if (error.status === 401) {
          // Manejar el error 401 aquí
     
          this.notificacionService.mostrarNotificacion(
            'No está autenticado o las credenciales son inválidas.'
          );
          // Puedes redirigir al usuario a la página de inicio de sesión si es necesario
          // this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
