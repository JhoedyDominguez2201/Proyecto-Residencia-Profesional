import { Component } from '@angular/core';
import { PlantillasService } from 'src/app/services/plantillas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-plantilla',
  templateUrl: './crear-plantilla.component.html',
  styleUrls: ['./crear-plantilla.component.css']
})
export class CrearPlantillaComponent {
  plantillaName: string = '';
  camposPlantilla: { name: string, type: string, required?: boolean }[] = [];

  constructor(private plantillasService: PlantillasService, private router: Router) {}

  agregarCampo() {
    // Puedes personalizar esto según tu lógica para agregar campos
    const nuevoCampo = { name: 'nuevoCampo', type: 'string', required: false };
    this.camposPlantilla.push(nuevoCampo);
  }

  quitarCampo(index: number) {
    this.camposPlantilla.splice(index, 1);
  }

  crearPlantilla() {
    const nombrePlantilla = this.plantillaName.toLowerCase().replace(/\s/g, '');

    // Asegúrate de que los nombres de los campos estén en minúsculas y sin espacios
    const camposActualizados = this.camposPlantilla.map(campo => ({
      name: campo.name.toLowerCase().replace(/\s/g, ''),
      type: campo.type,
      required: campo.required || false
    }));

    const solicitud = {
      plantilla_name: nombrePlantilla,
      fields: camposActualizados
    };

    this.plantillasService.crearPlantilla(solicitud).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
        
        // Muestra la alerta de éxito
        Swal.fire({
          title: "Creada",
          text: "La plantilla se ha creado exitosamente.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          // Redirige al usuario después de hacer clic en "Aceptar" en la alerta
          this.router.navigate(['admin/listar-plantillas']);
        });
      },
      (error: any) => {
        console.error('Error al crear la plantilla', error);
        
        // Muestra un mensaje de error al usuario en la interfaz
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al crear la plantilla. Por favor, inténtalo de nuevo.',
          confirmButtonColor: "#3085d6",
        });
        
        if (error.status === 400) {
          // Mensaje personalizado si hay un error de validación u otro problema específico
          // Puedes personalizar esto según las respuestas específicas que estés enviando desde Laravel.
          // this.showErrorToUser('Error de validación: ' + error.error.error);
        } else {
          // Otro tipo de error, muestra un mensaje general al usuario
          // this.showErrorToUser('Ocurrió un error al crear la plantilla.');
        }
      }
    );
  }
}
