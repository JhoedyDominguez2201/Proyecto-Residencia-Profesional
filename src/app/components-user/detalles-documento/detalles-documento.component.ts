import { Component, OnInit, OnDestroy } from '@angular/core';
import { DetallesDocumentoService } from 'src/app/services/detalles-documento.service';
import { HttpClient } from '@angular/common/http';
import { DocumentosService } from 'src/app/services/documentos.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserDocumentosService } from 'src/app/services/user-documentos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Lightbox, LightboxConfig } from 'ngx-lightbox'; // Importa el servicio y la configuración de ngx-lightbox
import { IEvent as LightboxEvent } from 'ngx-lightbox';

@Component({
  selector: 'app-detalles-documento',
  templateUrl: './detalles-documento.component.html',
  styleUrls: ['./detalles-documento.component.css']
})
export class DetallesDocumentoComponent implements OnInit, OnDestroy {
  tipoRecurso: string = '';
  idDocumento: string = '';
  tipoColeccion: string = '';
  detallesDocumento: any;
  rutaCompleta: string = '';
  usuarioId: string = '';
  comentarioFormulario!: FormGroup;
  userIdSubscription: Subscription = new Subscription();
  comentariosAprobados: any[] = [];
  lightboxImages: any[] = [];
  lightboxIndex = 0;
  lightboxInstance: any;
  lightboxOpen = false;
  lightboxClose = false;
  mostrarLightbox: boolean = false;

  constructor(
    private detallesDocumentoService: DetallesDocumentoService,
    private http: HttpClient,
    private documentosService: DocumentosService,
    private authService: AuthService,
    private userDocumentosService: UserDocumentosService,
    private fb: FormBuilder,
    private readonly lightbox: Lightbox,
    private readonly lightboxConfig: LightboxConfig 
  ) { this.lightboxConfig.centerVertically = true;
    this.lightboxConfig.disableScrolling = true;}

  ngOnInit() {
    this.detallesDocumentoService.tipoRecurso$.subscribe((tipoRecurso: string) => (this.tipoRecurso = tipoRecurso));
    this.detallesDocumentoService.idDocumento$.subscribe((idDocumento: string) => (this.idDocumento = idDocumento));
    this.detallesDocumentoService.tipoColeccion$.subscribe((tipoColeccion: string) => (this.tipoColeccion = tipoColeccion));

    this.userIdSubscription = this.authService.userId$.subscribe((userId: string) => {
      this.usuarioId = userId;
      this.cargarDetallesDocumento(); 
     

       // Obtener comentarios aprobados
       this.userDocumentosService.getComentariosAprobados(this.idDocumento).subscribe(
        (response: any) => {
          console.log('Respuesta de comentarios aprobados:', response);
          this.comentariosAprobados = response.comentariosAprobados;
        },
        (error) => {
          console.error('Error al obtener comentarios aprobados:', error);
        }
      );  
    });

    this.comentarioFormulario = this.fb.group({
      comentarioControl: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this.userIdSubscription.unsubscribe();
  }

  cargarDetallesDocumento() {
    if (this.idDocumento && this.tipoColeccion) {
      this.documentosService.getDocumentoById(this.tipoColeccion, this.idDocumento).subscribe(
        (detallesDocumento: any) => {
          this.detallesDocumento = detallesDocumento;
          console.log('detalles documento', detallesDocumento);
          console.log('Recurso Digital:', detallesDocumento['Recurso Digital']);

          // Utiliza un array para almacenar las rutas
          const recursosDigitales: any[] = [];

          // Verifica si hay recursos digitales
          if (detallesDocumento['Recurso Digital'] && detallesDocumento['Recurso Digital'].length > 0) {
            // Construye el array con la URL y descripciones de los recursos digitales
            detallesDocumento['Recurso Digital'].forEach((recurso: string, index: number) => {
              recursosDigitales.push({
                src: `http://localhost:8000/storage/${recurso}`,
                caption: `Imagen #${index + 1}`,
                thumb: '' // Puedes agregar la URL del pulgar si lo necesitas
              });
            });

            // Asigna las imágenes al lightbox
            this.lightboxImages = recursosDigitales;

            // Asigna la rutaCompleta solo después de obtener detalles del documento
            this.rutaCompleta = recursosDigitales.map(resource => resource.src).join(',');

            // Agrega un console.log para verificar la rutaCompleta final
            console.log('Ruta Completa Final:', this.rutaCompleta);
          }
        },
        (error) => {
          console.error('Error al cargar detalles del documento:', error);
        }
      );
    }
  }
  
  
  mostrarDetalle(key: string): boolean {
    return key !== '_id' && key !== 'created_at' && key !== 'updated_at';
  }

  enviarComentario() {
    if (this.comentarioFormulario) {
      const comentario = this.comentarioFormulario.get('comentarioControl')?.value;

      if (comentario != null) {
        if (comentario.trim() !== '') {  // Validar si el comentario no está vacío después de quitar espacios en blanco
          if (this.idDocumento && this.usuarioId) {
            this.userDocumentosService.enviarComentario(comentario, this.usuarioId, this.idDocumento).subscribe(
              (response) => {
                console.log('Comentario enviado con éxito', response);
                // Mostrar alerta de comentario exitoso
                Swal.fire({
                  icon: 'success',
                  title: 'El comentario se envió correctamente',
                  text: 'Tu comentario pasará a revisión por los administradores.',
                  confirmButtonColor: '#3085d6', 
                });
                this.comentarioFormulario.reset();
              },
              (error) => {
                console.error('Error al enviar el comentario', error);
                // Mostrar alerta de error en el envío del comentario
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Hubo un problema al enviar el comentario. Por favor, inténtalo de nuevo.',
                });
              }
            );
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Iniciar Sesión',
              text: 'Para dejar tu comentario debes tener una cuenta',
              confirmButtonColor: '#3085d6', 
            });
          }
        } else {
          // Mostrar alerta si el comentario está vacío
          Swal.fire({
            icon: 'warning',
            title: 'Comentario Vacío',
            text: 'Por favor, ingresa un comentario antes de enviarlo.',
            confirmButtonColor: '#3085d6', 
            confirmButtonText: 'Aceptar' // Cambia el texto del botón principal
          });
        }
      }
    }
  }

  descargarConMarcaAgua() {
    // Construye la URL de descarga utilizando los valores necesarios
    const urlDescarga = `http://localhost:8000/api/descargar-con-marca-agua/${this.tipoColeccion}/${this.idDocumento}`;

    // Realiza la solicitud de descarga
    this.http.get(urlDescarga, { responseType: 'blob' }).subscribe(
      (data: Blob) => {
        // Crea un objeto Blob y lo descarga como un archivo
        const blob = new Blob([data], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `recursos_digitales_marca_de_agua.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        console.error('Error al descargar con marca de agua:', error);
        // Muestra un mensaje de error al usuario si es necesario
      }
    );
  }
  
  capitalizeFirstLetter(value: unknown): string {
    if (value === undefined || value === null) {
      return '';
    }

    const stringValue = String(value);
    const stringWithoutUnderscores = stringValue.replace(/_/g, ' ');

    if (typeof stringWithoutUnderscores === 'string') {
      return stringWithoutUnderscores.charAt(0).toUpperCase() + stringWithoutUnderscores.slice(1);
    }

    return '';
  }


  openLightbox(index: number) {
    if (this.lightboxImages.length > 0) {
      // Cierra el lightbox si ya está abierto
      if (this.lightboxInstance) {
        this.lightboxInstance.close();
      }
  
      // Ábrelo con todas las imágenes y establece el índice proporcionado
      this.lightboxInstance = this.lightbox.open(this.lightboxImages, index, {
        centerVertically: true,
        disableScrolling: true,
        albumLabel: 'Image %1 of %2',
        alwaysShowNavOnTouchDevices: true,
      });
  
      // Restablece el índice del lightbox al abrirlo
      this.lightboxInstance.changeIndex(index);
    }
  }
  
  

  
  

  onLightboxEvent(event: LightboxEvent) {
    if (event && typeof event.id === 'string') {
      if (event.id === 'next') {
        this.lightboxIndex = this.lightboxIndex < this.lightboxImages.length - 1 ? this.lightboxIndex + 1 : 0;
      } else if (event.id === 'prev') {
        // Convierte this.lightboxIndex a number antes de la comparación
        this.lightboxIndex = +this.lightboxIndex > 0 ? this.lightboxIndex - 1 : this.lightboxImages.length - 1;
      }
    }
  }
}
