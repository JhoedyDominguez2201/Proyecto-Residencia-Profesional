import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDocumentosService {
  private apiUrl = 'http://localhost:8000/api'; // Actualiza la URL con la correcta
  
  
  constructor(private http: HttpClient) {}

  buscarPorPalabraClave(palabraClave: string): Observable<any> {
    const url = `${this.apiUrl}/plantillas/buscar-palabra-clave`;
    const data = { palabra_clave: palabraClave };

    return this.http.post(url, data);
  }

  enviarComentario(contenido: string, usuarioId: string, documentoId: string): Observable<any> {
    const comentarioData = { contenido: contenido, usuario_id: usuarioId, documento_id: documentoId };
    return this.http.post(`${this.apiUrl}/comentarios`, comentarioData);
  }

  getComentariosAprobados(documentoId: string): Observable<any> {
    const url = `${this.apiUrl}/comentarios/aprobados/${documentoId}`;
    return this.http.get(url);
  }
}