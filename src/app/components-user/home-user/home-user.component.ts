import { Component, OnInit } from '@angular/core';
import { CarrouselService } from 'src/app/services/carrousel.service';
import { HttpClient } from '@angular/common/http';
import { DetallesDocumentoService } from 'src/app/services/detalles-documento.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css']
})
export class HomeUserComponent implements OnInit {
  ultimosDocumentos: any = {};
  images: any[] = [];
  datos: { [key: string]: any[] } = {};
  mouseSobreTarjeta: boolean | null = null;

  constructor(
    private carrouselService: CarrouselService,
    private http: HttpClient,
    private detallesDocumentoService: DetallesDocumentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carrouselService.getImagesForCarousel().subscribe(
      (data: any) => {
        this.images = data;
        console.log('Imágenes recibidas:', this.images);
        this.obtenerUltimosDocumentos();
      },
      (error) => {
        console.error('Error al obtener las imágenes del carrusel:', error);
      }
    );
  }

  isArrayOfStrings(value: any): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
  }

  isImage(value: any): boolean {
    const extension = this.obtenerExtensionRecurso(value);
    const extensionesImagen = ['jpg', 'jpeg', 'png', 'gif'];
    return extensionesImagen.includes(extension.toLowerCase());
  }

  isPdf(value: any): boolean {
    const extension = this.obtenerExtensionRecurso(value);
    return extension.toLowerCase() === 'pdf';
  }

  isAudio(value: any): boolean {
    const extension = this.obtenerExtensionRecurso(value);
    const extensionesAudio = ['mp3', 'wav', 'ogg'];
    return extensionesAudio.includes(extension.toLowerCase());
  }

  isVideo(value: any): boolean {
    const extension = this.obtenerExtensionRecurso(value);
    const extensionesVideo = ['mp4', 'avi', 'mkv'];
    return extensionesVideo.includes(extension.toLowerCase());
  }

  getThumbnail(relativePath: string): string {
    const baseUrl = 'http://localhost:8000/storage';
    return `${baseUrl}/${encodeURIComponent(relativePath)}`;
  }

  obtenerUltimosDocumentos() {
    this.http.get<any>('http://localhost:8000/api/plantillas/last').subscribe(
      (response) => {
        this.ultimosDocumentos = response;
        console.log(response);
        this.datos = response;
      },
      (error) => {
        console.error('Error al obtener los últimos documentos', error);
      }
    );
  }

  verDetalle(tipoColeccion: string, idDocumento: string, RecursoDigital: string) {
    const idSinOid = typeof idDocumento === 'object' ? idDocumento['$oid'] : idDocumento;
    this.detallesDocumentoService.setTipoColeccion(tipoColeccion);
    this.detallesDocumentoService.setIdDocumento(idSinOid);
    this.detallesDocumentoService.setTipoRecurso(RecursoDigital);
    this.router.navigate(['/user/detalle-documento']);
  }

  obtenerExtensionRecurso(rutaRecurso: string | string[]): string {
    const ruta = Array.isArray(rutaRecurso) ? rutaRecurso[0] : rutaRecurso;
    if (ruta && typeof ruta === 'string') {
      const partesRuta = ruta.split('.');
      return partesRuta.length > 1 ? partesRuta[partesRuta.length - 1] : '';
    }
    return '';
  }

  transformString(value: any): string {
    return this.titleCase(value.replace(/_/g, ' '));
  }

  titleCase(str: string): string {
    return str.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
