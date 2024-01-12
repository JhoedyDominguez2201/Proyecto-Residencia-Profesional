import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentosService } from 'src/app/services/documentos.service';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-documento',
  templateUrl: './editar-documento.component.html',
  styleUrls: ['./editar-documento.component.css']
})
export class EditarDocumentoComponent implements OnInit {

  plantilla: string = '';
  documentoId: string = '';
  datosDocumento: any = {};
  nombreArchivoSeleccionado: string = '';
  form: FormGroup = new FormGroup({});
  nuevoArchivo: File | null = null;
  miniaturas: string[] = [];
  archivosAEliminar: string[] = [];

  constructor(private route: ActivatedRoute, private documentosService: DocumentosService, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.plantilla = params['plantillaName'];
      this.documentoId = params['documentoId'];

      if (this.plantilla && this.documentoId) {
        this.documentosService
          .getDocumentoById(this.plantilla, this.documentoId)
          .subscribe(
            (datos) => {
              this.datosDocumento = datos;
              this.nombreArchivoSeleccionado = this.extraerNombreArchivo(datos['Recurso Digital']);

              // Verifica si 'Recurso Digital' es un array o una cadena
              if (Array.isArray(datos['Recurso Digital'])) {
                this.miniaturas = datos['Recurso Digital'].map((ruta: string) => 'http://localhost:8000/storage/' + ruta);
              } else if (typeof datos['Recurso Digital'] === 'string') {
                this.miniaturas = ['http://localhost:8000/storage/' + datos['Recurso Digital']];
              }

              Object.keys(this.datosDocumento).forEach((campo) => {
                this.form.addControl(
                  campo,
                  new FormControl(this.datosDocumento[campo])
                );
              });

              console.log("documento obtenido", datos);
            },
            (error) => {
              console.error('Error obteniendo datos del documento', error);
            }
          );
      }
    });
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const newFile: File = fileList[0];

      if (this.isSupportedFile(newFile)) {
        this.nuevoArchivo = newFile;
        this.nombreArchivoSeleccionado = this.nuevoArchivo.name;

        // Verifica si el nuevo archivo es una imagen y agrega la miniatura
        if (this.isImageFile(newFile)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const miniaturaUrl = e.target?.result as string;
            this.miniaturas.push(miniaturaUrl);
          };
          reader.readAsDataURL(newFile);
        }
      } else {
        console.error('Tipo de archivo no compatible. Por favor, seleccione una imagen o un archivo compatible.');
      }
    }
  }

  isSupportedFile(file: File): boolean {
    // Verifica si el tipo de archivo es compatible (imagen, pdf, audio, video, etc.)
    return this.isImageFile(file) || this.isPdfFile(file) || this.isAudioFile(file) || this.isVideoFile(file);
  }

  isImageFile(file: File | string | string[]): boolean {
    if (file instanceof File) {
      // Si es un objeto File, verifica su tipo
      return file.type.startsWith('image/');
    } else if (Array.isArray(file)) {
      // Si es un array, verifica si al menos uno de los elementos es una imagen
      return file.some(item => this.isImageFile(item));
    } else {
      // Si es una cadena, verifica la extensión del archivo
      return this.checkImageExtension(file);
    }
  }
  
  private checkImageExtension(file: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExtensions.some(ext => file.endsWith(ext));
  }

  isPdfFile(file: File): boolean {
    const pdfExtensions = ['.pdf'];
    const fileName = file.name.toLowerCase();
    return pdfExtensions.some(ext => fileName.endsWith(ext));
  }

  isAudioFile(file: File): boolean {
    const audioExtensions = ['.mp3', '.wav'];
    const fileName = file.name.toLowerCase();
    return audioExtensions.some(ext => fileName.endsWith(ext));
  }

  isVideoFile(file: File): boolean {
    const videoExtensions = ['.mp4', '.avi'];
    const fileName = file.name.toLowerCase();
    return videoExtensions.some(ext => fileName.endsWith(ext));
  }

  extraerNombreArchivo(rutaOArray: string | string[]): string {
    const ruta = Array.isArray(rutaOArray) ? rutaOArray[0] : rutaOArray;

    if (typeof ruta === 'string') {
      const partesRuta = ruta.split('/');
      return partesRuta[partesRuta.length - 1];
    } else {
      console.error('La ruta no es una cadena:', ruta);
      return '';
    }
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  quitarMiniatura(index: number): void {
    const archivoAEliminar = this.miniaturas[index];
    this.archivosAEliminar.push(archivoAEliminar);
    this.miniaturas.splice(index, 1);
  }

  abrirVisualizador(ruta: string): void {
    const baseUrl = 'http://localhost:8000/storage/';
    const urlCompleta = baseUrl + ruta;

    if (typeof urlCompleta === 'string' && urlCompleta.endsWith('.pdf')) {
      window.open(urlCompleta, '_blank');
    } else if (typeof urlCompleta === 'string' && (urlCompleta.endsWith('.mp3') || urlCompleta.endsWith('.wav'))) {
      window.open(urlCompleta, '_blank');
    } else if (typeof urlCompleta === 'string' && (urlCompleta.endsWith('.mp4') || urlCompleta.endsWith('.avi'))) {
      window.open(urlCompleta, '_blank');
    } else {
      console.error('Tipo de archivo no compatible. No se puede abrir el visor.');
    }
  }

  
  onSubmit() {
    console.log('Datos del formulario:', this.form.value);
  
    const documentData = this.form.value;
  
    // Elimina campos innecesarios
    delete documentData['_id'];
    delete documentData['created_at'];
    delete documentData['updated_at'];
  
    console.log('Datos antes de mandar al FormData', documentData);
  
    // Llamada al servicio sin crear FormData en el componente
    this.documentosService.updateDocument(this.plantilla, this.documentoId, documentData, this.nuevoArchivo, this.archivosAEliminar).subscribe(
      (response) => {
        console.log('Documento actualizado con éxito:', response);
  
        Swal.fire({
          title: 'Éxito',
          text: 'El documento se ha editado exitosamente.',
          icon: 'success',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['admin/listar-documentos']);
        });
      },
      (error) => {
        console.error('Error al actualizar el documento:', error);
      }
    );
  }
  
  
  
}
