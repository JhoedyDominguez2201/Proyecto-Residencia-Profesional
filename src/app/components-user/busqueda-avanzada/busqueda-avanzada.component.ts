import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { PlantillasService } from 'src/app/services/plantillas.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DetallesDocumentoService } from 'src/app/services/detalles-documento.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-busqueda-avanzada',
  templateUrl: './busqueda-avanzada.component.html',
  styleUrls: ['./busqueda-avanzada.component.css']
})
export class BusquedaAvanzadaComponent implements OnInit {
  colecciones: string[] = [];
  selectedColeccion: string = '';
  camposPorColeccion: { [coleccion: string]: string[] } = {};
  selectedCampos: { name: string, type: string, editable: boolean, valor?: any }[] = [];
  resultados: any[] = [];
  mostrarResultados = false;
  mouseSobreResultado: any = null; // Puedes utilizar cualquier tipo que admita null


  constructor(private plantillasService: PlantillasService, private http: HttpClient, private router: Router, private detallesDocumentoService:DetallesDocumentoService) {}

  ngOnInit() {
    this.plantillasService.getPlantillas().subscribe(
      (data: string[]) => {
        this.colecciones = data;
        console.log(this.colecciones);  // Agrega esto para verificar si colecciones tiene datos
      },
      (error) => {
        console.error(error);
      }
    );
  }

    onColeccionChange() {
      // Verifica si se ha seleccionado una colección antes de obtener los campos
      if (this.selectedColeccion) {
        this.plantillasService.getFields(this.selectedColeccion).subscribe(
          (campos: any[]) => {
            console.log(`Campos de la plantilla ${this.selectedColeccion}:`, campos);
    
            // Asigna los campos seleccionados directamente a selectedCampos
            this.selectedCampos = campos.map((campo: any) => ({ name: campo.name, type: campo.type, editable: false, valor: null }));
            console.log('Campos seleccionados:', this.selectedCampos);
          },
          (error) => {
            console.error(`Error al obtener los campos de la plantilla ${this.selectedColeccion}`, error);
            // Si hay un error, limpia los campos seleccionados
            this.selectedCampos = [];
            console.log('Campos seleccionados:', this.selectedCampos);
          }
        );
      } else {
        // Si no se ha seleccionado una colección, limpia los campos
        this.selectedCampos = [];
        console.log('Campos seleccionados:', this.selectedCampos);
      }
      console.log('Colección seleccionada:', this.selectedColeccion);
      // Puedes hacer una llamada al servicio de búsqueda avanzada aquí
    }
  
  
  buscarAvanzado() {
    Swal.fire({
      title: 'Buscando documentos',
      text: 'Estamos buscando documentos, por favor espera...',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    // Obtener los campos editables que tienen un valor
    const camposFiltrados = this.selectedCampos.filter(campo => campo.editable && campo.valor);
  
    // Construir el cuerpo de la solicitud
    const body = {
      palabras_clave: camposFiltrados.map(campo => campo.valor),
      nombre_coleccion: this.selectedColeccion
    };
  
    // Verificar si hay al menos un campo editable con valor
    if (camposFiltrados.length > 0) {
      camposFiltrados.forEach(campo => {
        if (campo.type === 'number' && typeof campo.valor === 'number') {
          campo.valor = campo.valor.toString();
        }
      });
  
      // Enviar la solicitud HTTP al endpoint correspondiente en Laravel
      this.http.post('http://127.0.0.1:8000/api/plantillas/avanzada-busqueda', body).subscribe(
        (response: any) => {
          Swal.close();
          // Manejar la respuesta del servidor (puede incluir los resultados de búsqueda)
          this.resultados = response;
          this.mostrarResultados = true;
          console.log('Respuesta del servidor:', this.resultados);
        },
        (error) => {
          Swal.close();
          // Manejar errores
          console.error('Error en la solicitud HTTP:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error en la búsqueda',
            text: 'Hubo un problema al buscar documentos. Por favor, inténtalo de nuevo.',
          });
        }
      );
    } else {
      // Si no hay campos editables con valor, mostrar todos los datos de la colección
      const body = {
        palabras_clave: ([]),
        nombre_coleccion: this.selectedColeccion
      };
  
      this.http.post('http://127.0.0.1:8000/api/plantillas/avanzada-busqueda', body).subscribe(
        (response: any) => {
          Swal.close();
          this.resultados = response;
          this.mostrarResultados = true;
          console.log('Todos los resultados de la colección:', this.resultados);
        },
        (error) => {
          Swal.close();
          console.error('Error en la solicitud HTTP:', error);
        }
      );
    }
  }
  

    verDocumento(resultado: any) {
      const tipoRecurso = this.obtenerTipoRecurso(resultado['Recurso Digital']);
      const tipoColeccion = resultado['tipo_coleccion']; // Agregar el tipo de colección
      const idDocumento = resultado['_id']['$oid'];
      // Usar el servicio para compartir datos entre componentes
      this.detallesDocumentoService.setTipoRecurso(tipoRecurso);
      this.detallesDocumentoService.setIdDocumento(idDocumento);
      this.detallesDocumentoService.setTipoColeccion(tipoColeccion); // Establecer el tipo de colección

      // Navegar a la página de detalles con los parámetros necesarios
      this.router.navigate(['/user/detalle-documento']);
    }

    private obtenerTipoRecurso(recursoDigital: string[] | undefined): string {
      if (!recursoDigital || recursoDigital.length === 0) {
        console.error('Recurso Digital no contiene elementos válidos.');
        return '';
      }
    
      const primerElemento = recursoDigital[0];
    
  
      const extension = primerElemento.split('.').pop();
      return extension ? extension.toLowerCase() : '';
    }
    

    // ...
    onInputChange(campo: any) {
      // Actualizar el estado editable basado en si el valor está vacío o no
      campo.editable = campo.valor.trim() !== '';
    }
    
    
    onCheckboxChange(event: any, campo: any) {
      // Actualiza el valor del campo según el estado del checkbox
      campo.editable = event.target.checked;
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
  }
