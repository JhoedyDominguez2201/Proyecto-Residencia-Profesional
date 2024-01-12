import { Component, OnInit } from '@angular/core';
import { ComentariosService } from 'src/app/services/comentarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})

export class ComentariosComponent implements OnInit {
  comentariosPendientes: any[] = [];
  comentariosAprobados: any[] = [];
  vistaSeleccionada: string = 'pendientes'; // Agregado para gestionar la vista seleccionada
  nombreDocumento: string = ''; // Agregado para almacenar el nombre del documento
  nombreUsuario: string = ''; // Agregado para almacenar el nombre del usuario

  constructor(private comentariosService: ComentariosService, private authservice:AuthService, private documentosService:DocumentosService) {}
  ngOnInit() {
    this.obtenerComentarios();
  }


  obtenerDatos() {
    // Llamamos a getUserProfile para obtener el nombre del usuario
    //Llamamos a getdocumentById para obtener el nombre del documento 
  }




  obtenerComentarios() {
    if (this.vistaSeleccionada === 'pendientes') {
      this.comentariosService.getComentariosPendientes().subscribe(
        (response) => {
          this.comentariosPendientes = response.comentariosPendientes;
        },
        (error) => {
          console.error('Error al obtener comentarios pendientes:', error);
        }
      );
    } else if (this.vistaSeleccionada === 'aprobados') {
      this.comentariosService.getComentariosAprobados().subscribe(
        (response) => {
          this.comentariosAprobados = response.comentariosAprobados;
        },
        (error) => {
          console.error('Error al obtener comentarios aprobados:', error);
        }
      );
    }
  }

  aprobarComentario(comentarioId: string) {
    // Mostrar la alerta de confirmación
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aprobar comentario"
    }).then((result) => {
      // Verificar si el usuario hizo clic en "Sí"
      if (result.isConfirmed) {
        // Lógica para aprobar el comentario
        this.comentariosService.aprobarComentario(comentarioId).subscribe(
          (response) => {
            // Actualizar la lista de comentarios pendientes o aprobados según la vista seleccionada
            this.obtenerComentarios();
            Swal.fire({
              title: "Aprobado",
              text: "El comentario ha sido aprobado.",
              icon: "success",
              confirmButtonColor: "#3085d6",
            })
          },
          (error) => {
            console.error('Error al aprobar comentario:', error);
          }
        );
      }
    });
  }

  denegarComentario(comentarioId: string) {
    // Mostrar la alerta de confirmación
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, denegar comentario"
    }).then((result) => {
      // Verificar si el usuario hizo clic en "Sí"
      if (result.isConfirmed) {
        // Lógica para denegar el comentario
        this.comentariosService.denegarComentario(comentarioId).subscribe(
          () => {
            // Actualizar la lista de comentarios pendientes según la vista seleccionada
            this.obtenerComentarios();

            // Mostrar notificación de éxito
            Swal.fire({
              title: "Denegado",
              text: "El comentario ha sido denegado y eliminado con exito.",
              icon: "success",
              confirmButtonColor: "#3085d6",
            })          },
          (error) => {
            console.error('Error al denegar comentario:', error);
          }
        );
      }
    });
  }


  
}