// comentarios.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ComentariosService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Reemplaza con tu URL de API
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    }
    return this.headers;
  }

  // Método para aprobar un comentario
  aprobarComentario(comentarioId: string): Observable<any> {
    const url = `${this.apiUrl}/comentarios/aprobar/${comentarioId}`;
    return this.http.put(url, {}, { headers: this.getHeaders() });
  }

  // Método para denegar un comentario
  denegarComentario(comentarioId: string): Observable<any> {
    const url = `${this.apiUrl}/comentarios/denegar/${comentarioId}`;
    return this.http.delete(url, { headers: this.getHeaders() });
  }

  // Método para obtener comentarios pendientes
  getComentariosPendientes(): Observable<any> {
    const url = `${this.apiUrl}/comentarios/pendientes`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

   // Método para obtener comentarios pendientes
   getComentariosAprobados(): Observable<any> {
    const url = `${this.apiUrl}/comentarios/aprobados`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
}
