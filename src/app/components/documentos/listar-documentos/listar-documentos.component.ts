import { Component, OnInit } from '@angular/core';
import { DocumentosService } from 'src/app/services/documentos.service';
import { PlantillasService } from 'src/app/services/plantillas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Lightbox, LightboxConfig} from 'ngx-lightbox'; // Importa el servicio y la configuración de ngx-lightbox
import { IEvent as LightboxEvent } from 'ngx-lightbox';

@Component({
  selector: 'app-listar-documentos',
  templateUrl: './listar-documentos.component.html',
  styleUrls: ['./listar-documentos.component.css']
})
export class ListarDocumentosComponent implements OnInit {
  colecciones: string[] = [];
  selectedColeccion: string | null = null;
  documentos: any[] = [];
  camposDocumento: string[] = [];
  plantillaName: string | null = null;

  lightboxImages: any[] = [];
  lightboxIndex = 0;

  constructor(
    private documentosService: DocumentosService,
    private plantillasService: PlantillasService,
    private router: Router,
    private readonly lightbox: Lightbox,
    private readonly lightboxConfig: LightboxConfig
  ) {}

  ngOnInit() {
    this.documentosService.getColecciones().subscribe(
      (colecciones: string[]) => {
        this.colecciones = colecciones;
      },
      error => {
        console.error('Error obteniendo colecciones', error);
      }
    );
  }


  formatFieldName(fieldName: string): string {
    // Reemplaza los guiones bajos con espacios y aplica title case
    return fieldName.replace(/_/g, ' ').replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase());
  }
  
  
  
  onColeccionSelected() {
    if (this.selectedColeccion !== null) {
      this.plantillaName = this.selectedColeccion;

      this.documentosService.getAllDocuments(this.selectedColeccion).subscribe(
        (documentos: any[]) => {
          this.documentos = documentos;

          if (documentos.length > 0) {
            let documentoConMasCampos = documentos[0];

            for (const documento of documentos) {
              if (Object.keys(documento).length > Object.keys(documentoConMasCampos).length) {
                documentoConMasCampos = documento;
              }
            }

            this.camposDocumento = Object.keys(documentoConMasCampos);
            console.log(this.camposDocumento);
          } else {
            console.warn('La colección está vacía.');
          }
        },
        error => {
          console.error('Error obteniendo documentos', error);
        }
      );
    }
  }

  getAbsoluteFileUrl(relativePath: string): string {
    // Asegúrate de agregar la ruta correcta, en este caso 'public'
    const baseUrl = 'http://localhost:8000/storage';
    // Construye la URL completa
    return `${baseUrl}/${encodeURIComponent(relativePath)}`;

  }


  eliminarDocumento(documentoId: string | null) {
    if (documentoId !== null && this.plantillaName !== null) {
      const documentoIdStr = typeof documentoId === 'object' ? documentoId['$oid'] : String(documentoId);

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este documento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.plantillaName !== null) {
            this.documentosService.eliminarDocumento(this.plantillaName, documentoIdStr).subscribe(
              response => {
                console.log('Documento eliminado con éxito', response);

                Swal.fire({
                  title: 'Eliminado',
                  text: 'El documento se ha eliminado exitosamente.',
                  icon: 'success',
                  confirmButtonColor: '#3085d6'
                }).then(() => {
                  window.location.reload();
                });
              },
              error => {
                console.error('Error al eliminar el documento', error);
              }
            );
          } else {
            console.error('Error: plantillaName es null.');
          }
        } else {
          console.log('Eliminación cancelada por el usuario.');
        }
      });
    } else {
      console.error('Error: documentoId es null o plantillaName no está definido.');
    }
  }

  editarDocumento(plantillaName: string, documentoId: any) {
    if (plantillaName && documentoId) {
      const idDelDocumento = typeof documentoId === 'object' ? documentoId.$oid : documentoId;

      this.router.navigate(['admin/editar-documento'], { queryParams: { plantillaName, documentoId: idDelDocumento } });
    } else {
      console.error('Nombre de plantilla o ID de documento no válido:', plantillaName, documentoId);
    }
  }

  openLightbox(imagePaths: string[]) {
    this.lightboxImages = [];
    this.lightbox.close(); // Cierra cualquier lightbox existente
  
    const album = imagePaths.map((path, index) => ({
      src: this.getAbsoluteFileUrl(path),
      caption: `Imagen #${index + 1}`,
      thumb: '',
      id: index
    }));
  
    this.lightboxImages = album;
    this.lightboxIndex = 0;
    this.lightbox.open(this.lightboxImages, this.lightboxIndex);
  }
  
  

  openPdf(resource: string) {
    // Aquí implementa la lógica para abrir el visor de PDF (usando una biblioteca como ngx-extended-pdf-viewer o ng2-pdf-viewer)
    // Puedes agregar una condición para manejar diferentes bibliotecas o métodos según tus necesidades.
    // Ejemplo (usando ngx-extended-pdf-viewer):
    window.open(this.getAbsoluteFileUrl(resource), '_blank');
  }

  openVideo(resource: string) {
    // Aquí implementa la lógica para abrir el visor de video (puedes usar el reproductor de video nativo o una biblioteca como ngx-videogular)
    // Ejemplo (usando el reproductor de video nativo):
    window.open(this.getAbsoluteFileUrl(resource), '_blank');
  }
  
  openAudio(resource: string) {
    // Aquí implementa la lógica para abrir el visor de audio (puedes usar el reproductor de audio nativo o una biblioteca como ngx-audio-player)
    // Ejemplo (usando el reproductor de audio nativo):
    window.open(this.getAbsoluteFileUrl(resource), '_blank');
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

  openResource(resources: string[]) {
    console.log('Recursos obtenidos en openResource:', resources);
  
    for (const resource of resources) {
      const extension = this.getFileExtension(resource);
  
      switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
          // Para imágenes, abrir el lightbox
          console.log('Recurso Digital antes de abrir el lightbox:', resource);
          this.openLightbox(resources);

          break;
  
      case 'pdf':
        // Para PDF, llamar al método openPdf (asegúrate de haberlo implementado)
        this.openPdf(resource);
        break;
  
      case 'mp4':
      case 'avi':
        // Para videos, abrir el visualizador de video (puedes implementar esto)
        this.openVideo(resource);
        break;
  
      case 'mp3':
      case 'wav':
        // Para audio, abrir el visualizador de audio (puedes implementar esto)
        this.openAudio(resource);
        break;
  
      default:
        console.error(`Tipo de archivo no compatible: ${extension}`);
        break;
    }
  }
}
  
  onResourceIconClick(resource: any) {
    if (Array.isArray(resource) && resource.length > 0) {
      const extension = this.getFileExtension(resource[0]); // Se toma la extensión del primer recurso
  
      // Llamas al método openResource para manejar el recurso según su tipo
      this.openResource(resource);
    } else if (typeof resource === 'string') {
      const extension = this.getFileExtension(resource);
      console.log('Extension:', extension);
  
      // Llamas al método openResource para manejar el recurso según su tipo
      this.openResource([resource]); // Se envuelve la cadena en un array
    } else {
      console.error('El recurso digital no es un array o una cadena:', resource);
    }
  }
  
  
  

  getFileExtension(filename: string): string {
    return filename.split('.').pop() || ''; // Obtiene la última parte después del último punto
  }
  
}  