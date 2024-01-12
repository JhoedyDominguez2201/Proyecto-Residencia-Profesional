import { Component, OnInit} from '@angular/core';
import { CarrouselService } from 'src/app/services/carrousel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrousel-upload',
  templateUrl: './carrousel-upload.component.html',
  styleUrls: ['./carrousel-upload.component.css']
})
export class CarrouselUploadComponent implements OnInit {

  startDate: string = '';
  endDate: string = '';
  selectedFile: File | null = null;
  allImagesData: any[] = [];

  constructor(private carrouselService: CarrouselService) {}

  ngOnInit(): void {
    // Cuando el componente se inicia, obtén todas las imágenes del carrusel
    this.getAllImages();
  }
  onFileChange(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }
  uploadImage(): void {
    if (this.selectedFile) {
      this.carrouselService.uploadImage(this.selectedFile, this.startDate, this.endDate).subscribe(
        response => {
          console.log('Imagen subida exitosamente');
  
          // Muestra la alerta de éxito
          Swal.fire({
            icon: 'success',
            title: 'Imagen subida exitosamente',
            showConfirmButton: false,
            timer: 1500,
            confirmButtonColor: '#3085d6',

          }).then(() => {
            // Acción que se ejecutará después de que el usuario haga clic en el botón "OK"
            // En este caso, recargar la página
            location.reload();
          });
  
          // Puedes manejar la respuesta según tus necesidades
          // Puedes agregar más lógica aquí, como recargar la lista de imágenes, etc.
  
        },
        error => {
          console.error('Error al subir la imagen', error);
  
          // Muestra la alerta de error
          Swal.fire({
            icon: 'error',
            title: 'Error al subir la imagen',
            text: 'Por favor, inténtelo nuevamente',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#3085d6',

          });
  
          // Puedes manejar el error según tus necesidades
        }
      );
    } else {
      // Muestra la alerta si no se ha seleccionado ninguna imagen
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona una imagen',
        text: 'Por favor, selecciona una imagen antes de intentar subirla',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#3085d6',

      });
    }
  }
  

  getAllImages(): void {
    this.carrouselService.getAllImagesForCarousel().subscribe(
      (data: any) => {
        console.log('Todas las imágenes del carrusel:', data);
        this.allImagesData = data;
        // Actualiza tu lista de imágenes o realiza otras acciones necesarias
      },
      error => {
        console.error('Error al obtener todas las imágenes del carrusel', error);
        // Maneja el error según tus necesidades
      }
    );
  }
  
  obtenerNombreImagen(rutaCompleta: string): string {
    // Utiliza la función replace para quitar la parte del dominio y la ruta base
    return rutaCompleta.replace('http://localhost:8000/storage/carrousel_images/', '');
  }

  
eliminarImagen(id: string): void {
  // Muestra la alerta de confirmación
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'La imagen se eliminará permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario confirma, llama al servicio para eliminar la imagen por su ID
      this.carrouselService.eliminarImagen(id).subscribe(
        response => {
          console.log('Imagen eliminada exitosamente');

          // Muestra la alerta de éxito
          Swal.fire({
            icon: 'success',
            title: 'Imagen eliminada exitosamente',
            showConfirmButton: false,
            timer: 1500
          });

          // Actualiza la lista de imágenes o realiza otras acciones necesarias
          this.getAllImages();
        },
        error => {
          console.error('Error al eliminar la imagen', error);

          // Muestra la alerta de error
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar la imagen',
            text: 'Por favor, inténtelo nuevamente',
            confirmButtonText: 'Cerrar'
          });

          // Puedes manejar el error según tus necesidades
        }
      );
    }
  });
}
  abrirImagen(rutaImagen: string): void {
    window.open(rutaImagen, '_blank');
  }
  
  
}
