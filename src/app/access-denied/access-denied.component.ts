import { Component, OnInit } from '@angular/core';
import { NotificacionService } from '../notificacion.service';


@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit{
  mensaje: string | null = null;

  constructor(private notificacionService: NotificacionService) {}
ngOnInit(): void {
    // Suscribirse al servicio de notificaciones para recibir mensajes
    this.notificacionService.notificacion$.subscribe((mensaje: string) => {
      this.mensaje = mensaje;
    });
  }

}
