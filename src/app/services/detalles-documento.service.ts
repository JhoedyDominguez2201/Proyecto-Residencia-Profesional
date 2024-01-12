// detalles-documento.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesDocumentoService {
  private tipoRecursoSource = new BehaviorSubject<string>('');
  private idDocumentoSource = new BehaviorSubject<string>('');
  private tipoColeccionSource = new BehaviorSubject<string>(''); // Agregar el tipo de colección


  tipoRecurso$ = this.tipoRecursoSource.asObservable();
  idDocumento$ = this.idDocumentoSource.asObservable();
  tipoColeccion$ = this.tipoColeccionSource.asObservable(); // Observador para el tipo de colección


  setTipoRecurso(tipoRecurso: string) {
    this.tipoRecursoSource.next(tipoRecurso);
  }

  setIdDocumento(idDocumento: string) {
    this.idDocumentoSource.next(idDocumento);
  }
  setTipoColeccion(tipoColeccion: string) {
    this.tipoColeccionSource.next(tipoColeccion); // Método para establecer el tipo de colección
  }



  

}
