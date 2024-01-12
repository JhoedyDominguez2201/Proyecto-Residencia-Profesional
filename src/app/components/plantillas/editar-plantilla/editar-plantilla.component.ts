import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlantillasService } from 'src/app/services/plantillas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-plantilla',
  templateUrl: './editar-plantilla.component.html',
  styleUrls: ['./editar-plantilla.component.css']
})
export class EditarPlantillaComponent implements OnInit {

  nombrePlantilla: string = '';
  datosPlantilla: any;
  camposPlantilla: { name: string, type: string, required?: boolean }[] = [];
  
  nuevoCampoNombre: string = '';
  nuevoCampoTipo: string = '';
  mostrarInput: boolean = false;
  nuevoCampoRequerido: boolean = false; // Agregada esta línea

  constructor(private route: ActivatedRoute, private plantillasService: PlantillasService, private router: Router) {}

  ngOnInit() {
    this.nombrePlantilla = this.route.snapshot.paramMap.get('nombrePlantilla')!;
    this.obtenerDatosPlantilla();
  }

  obtenerClaves(): number[] {
    return Array.from({ length: this.camposPlantilla.length }, (_, i) => i);
  }

  obtenerDatosPlantilla() {
    if (this.nombrePlantilla) {
      this.plantillasService.getFields(this.nombrePlantilla).subscribe(
        (campos: any) => {
          if (Array.isArray(campos)) {
            this.camposPlantilla = campos.map((campo: any) => ({
              name: campo.name,
              type: campo.type,
              required: campo.required || false
            }));
          } else {
            console.error('La respuesta del servidor no es un array válido.');
          }
        },
        error => {
          console.error('Error obteniendo campos de la plantilla', error);
        }
      );
    }
  }

  onSubmit() {
    const camposActualizados = this.camposPlantilla.filter(campo => campo.name !== '_id');

    this.plantillasService.updatePlantilla(this.nombrePlantilla, camposActualizados).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);

        Swal.fire({
          title: 'Actualizada',
          text: 'La plantilla se ha actualizado exitosamente.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.router.navigate(['admin/listar-plantillas']);
        });
      },
      error => {
        console.error('Error al actualizar campos', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar la plantilla. Por favor, inténtalo de nuevo.',
          confirmButtonColor: '#3085d6',
        });
      }
    );
  }

  agregarCampo() {
    const nuevoCampoNombre = `nuevoCampo${this.camposPlantilla.length + 1}`;

    const nuevoCampo = { 
        name: nuevoCampoNombre, 
        type: 'string', 
        required: this.nuevoCampoRequerido 
    };

    // Añade el nuevo campo al array
    this.camposPlantilla.push(nuevoCampo);
}

  eliminarCampo(index: number) {
    this.camposPlantilla.splice(index, 1);
  }
}
