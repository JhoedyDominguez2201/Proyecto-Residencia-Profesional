import { Component, OnInit } from '@angular/core';
import { PlantillasService } from 'src/app/services/plantillas.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-documento',
  templateUrl: './crear-documento.component.html',
  styleUrls: ['./crear-documento.component.css']
})
export class CrearDocumentoComponent implements OnInit {
  plantillas: string[] = [];
  selectedPlantilla: string | null = null;
  camposPlantilla: { name: string; type: string; alias: string; required?: boolean }[] = [];
  documentData: any = {};
  files: File[] = []; // Variable para almacenar los archivos seleccionados
 // Función para verificar si el archivo es una imagen
 isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

// Función para obtener la URL de la miniatura de la imagen
getThumbnailUrl(file: File): string | null {
  if (this.isImageFile(file)) {
    return URL.createObjectURL(file);
  }
  return null;
}

// Función para eliminar un archivo de la lista
removeFile(index: number): void {
  this.files.splice(index, 1);
}

  constructor(private plantillasService: PlantillasService, private documentosService: DocumentosService) { }

  ngOnInit() {
    // Obtiene la lista de plantillas al inicializar el componente
    this.plantillasService.getPlantillasforDocuments().subscribe(
      (plantillas: string[]) => {
        this.plantillas = plantillas;
      },
      error => {
        console.error('Error obteniendo plantillas', error);
      }
    );
  }

  onPlantillaSelected() {
    if (this.selectedPlantilla) {
      this.plantillasService.getFields(this.selectedPlantilla).subscribe(
        (fields: any) => {
          this.camposPlantilla = (fields as { name: string, type: string, alias: string, required?: boolean }[])
            .map(field => ({ ...field, required: field.required || false }));

          // ... (otros códigos)
        },
        error => {
          console.error('Error obteniendo campos de la plantilla', error);
        }
      );
    }
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      // Limpiar la lista de archivos antes de agregar nuevos
      this.files = [];
  
      // Guarda todos los archivos seleccionados
      this.files.push(...Array.from(fileList));
    }
  }
  

  onSubmit() {
    // Verifica si todos los campos obligatorios están llenos
    
    const camposRequeridosVacios = this.camposPlantilla
      .filter(campo => campo.required)
      .some(campo => {
        if (campo.type === 'file') {
          // Verifica si el campo de tipo file está vacío
          return campo.required && (!this.files || this.files.length === 0);
        } else {
          // Para otros tipos, verifica simplemente si el campo requerido está vacío
          return campo.required && !this.documentData[campo.name];
        }
      });
  
    if (camposRequeridosVacios) {
      // Muestra una alerta indicando que hay campos requeridos vacíos
      Swal.fire({
        icon: 'error',
        title: 'Campos Obligatorios',
        text: 'Por favor, completa todos los campos obligatorios.',
        confirmButtonColor: '#3085d6',
      });
      return; // Evita que se envíe el formulario si hay campos requeridos vacíos
    }
  
    // Filtra los campos de tipo 'file' del objeto documentData
    const filteredDocumentData: Record<string, any> = Object.keys(this.documentData)
      .filter(key => {
        const campo = this.camposPlantilla.find(campo => campo.name === key);
        return campo && campo.type !== 'file';
      })
      .reduce((obj, key) => {
        obj[key] = this.documentData[key];
        return obj;
      }, {} as Record<string, any>);
  
    // Verifica si this.files no es null antes de enviar la solicitud
    const filesValue: File[] | undefined = this.files && this.files.length > 0 ? this.files : undefined;
    console.log('Datos del documento antes de enviar:', this.documentData);

    if (this.selectedPlantilla) {
      this.documentosService.storeDocument(this.selectedPlantilla, filesValue || undefined, filteredDocumentData)
        .subscribe(
          response => {
            console.log(this.documentData);
            console.log('Documento creado con éxito', response);
  
            // Muestra la alerta de éxito
            Swal.fire({
              title: 'Éxito',
              text: 'El documento se ha creado exitosamente.',
              icon: 'success',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              window.location.reload();
            });
          },
          error => {
            console.error('Error al crear el documento', error);
  
            // Muestra una alerta de error
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al crear el documento. Por favor, inténtalo de nuevo.',
              icon: 'error',
              confirmButtonColor: '#3085d6'
            });
          }
        );
    } else {
      console.error('Error: selectedPlantilla es null.');
    }
  }
}
