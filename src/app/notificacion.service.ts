// notificacion.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private notificacionSubject = new Subject<string>();

  notificacion$ = this.notificacionSubject.asObservable();

  constructor(private router:Router) {}

  mostrarNotificacion(mensaje: string): void {
    // Utilizar SweetAlert para mostrar el mensaje
    Swal.fire({
      title: 'Acceso no autorizado',
      text: mensaje,
      allowOutsideClick: false, // No permitir cerrar haciendo clic fuera de la alerta
      icon: 'error',
      backdrop: `
      rgba(0,0,0,0.9)`
    }).then(() => {
      // Acción que se ejecutará después de que el usuario haga clic en el botón "OK"
      // En este caso, recargar la página
      this.router.navigate(['/admin/home-admin']);
    });
  }
}
