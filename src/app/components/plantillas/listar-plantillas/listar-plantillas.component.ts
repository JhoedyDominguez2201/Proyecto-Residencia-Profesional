import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantillasService } from '../../../services/plantillas.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-listar-plantillas',
  templateUrl: './listar-plantillas.component.html',
  styleUrls: ['./listar-plantillas.component.css']
})
export class ListarPlantillasComponent implements OnInit {

  plantillas: any[] = [];

  constructor(private router: Router, private plantillasService: PlantillasService) {}

  ngOnInit(): void {
    this.obtenerPlantillas();
  }

  obtenerPlantillas() {
    this.plantillasService.getPlantillas().subscribe(
      (plantillas) => {
        this.plantillas = plantillas;
      },
      (error) => {
        console.error('Error al obtener las plantillas', error);
      }
    );
  }

  editarPlantilla(plantilla: string) {
    if (plantilla) {
        // Navega a la página de edición con el nombre de la plantilla como parámetro
        this.router.navigate(['/admin/editar-plantilla', plantilla]);
    } else {
        console.error('Nombre de plantilla no válido:', plantilla);
    }
  }

  eliminarPlantilla(plantillaName: string) {
    // Mostrar la alerta de confirmación
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar plantilla"
    }).then((result) => {
      // Verificar si el usuario hizo clic en "Sí"
      if (result.isConfirmed) {
        // Lógica para eliminar la plantilla
        this.plantillasService.deletePlantilla(plantillaName).subscribe(
          (response: any) => {
            console.log('Respuesta del servidor:', response);
            // Puedes agregar lógica adicional aquí, como actualizar la interfaz de usuario, etc.
            Swal.fire({
              title: "Eliminada",
               text: "La plantilla ha sido eliminada con exito",
              icon: "success",
              confirmButtonColor: "#3085d6",
            }).then(() => {
              // Ejecutar location.reload() después de hacer clic en "Aceptar"
              location.reload();
            });
          },
          (error: any) => {
            console.error('Error al eliminar la plantilla', error);
            // Puedes manejar errores y mostrar mensajes al usuario según sea necesario.
            Swal.fire("Error", "Hubo un problema al eliminar la plantilla. Por favor, inténtalo de nuevo.", "error");
          }
        );
      }
    });
  }
}