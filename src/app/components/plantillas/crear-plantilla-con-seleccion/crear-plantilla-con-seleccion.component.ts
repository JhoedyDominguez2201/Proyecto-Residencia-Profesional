// crear-plantilla-con-seleccion.component.ts

import { Component, OnInit } from '@angular/core';
import { PlantillasService } from 'src/app/services/plantillas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-crear-plantilla-con-seleccion',
  templateUrl: './crear-plantilla-con-seleccion.component.html',
  styleUrls: ['./crear-plantilla-con-seleccion.component.css']
})
export class CrearPlantillaConSeleccionComponent {
  plantillaName: string = '';
  plantillaSeleccionada: any = {}; // Cambiado a objeto para almacenar toda la información de la plantilla
  plantillas: any[] = [];
  camposPlantilla: { name: string; type: string; required: boolean; valor: any }[] = [];

  constructor(private plantillasService: PlantillasService, private router: Router) {
    this.cargarPlantillas();
  }
  cargarPlantillas() {
    this.plantillasService.obtenerPlantillasPredeterminadas().subscribe(
      (plantillas: any[]) => {
        console.log('Plantillas recibidas:', plantillas);
        this.plantillas = plantillas;  // Ahora, plantillas contiene toda la información de cada plantilla
      },
      (error: any) => {
        console.error('Error al obtener las plantillas', error);
      }
    );
  }
  seleccionarPlantilla() {
    // Buscar el objeto completo de la plantilla seleccionada
    this.plantillaSeleccionada = this.plantillas.find(plantilla => plantilla.nombre === this.plantillaSeleccionada);

    // Inicializar camposPlantilla con los campos de la plantilla seleccionada
    if (this.plantillaSeleccionada && this.plantillaSeleccionada.campos) {
      this.camposPlantilla = this.plantillaSeleccionada.campos.map((campo: any) => ({
        name: campo.nombre,
        type: campo.tipo,
        valor: ''
      }));
    } else {
      this.camposPlantilla = [];
    }
  }
 
  agregarCampo() {
    const nuevoCampo = { name: 'Nuevo Campo', type: 'texto', required: false, valor: '' };
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
      required: campo.required  // Añade la propiedad 'required' al objeto del campo
    }));

    const solicitud = {
      plantilla_name: nombrePlantilla,
      plantilla_seleccionada: this.plantillaSeleccionada,
      fields: camposActualizados
    };

    this.plantillasService.crearPlantilla(solicitud).subscribe(
      (response: any) => {
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