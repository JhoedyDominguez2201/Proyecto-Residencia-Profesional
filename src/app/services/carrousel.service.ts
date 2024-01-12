// carrousel.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class CarrouselService {
  private apiUrl = 'http://localhost:8000/api'; // Reemplaza con la URL de tu backend
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

  uploadImage(image: File, startDate: string, endDate: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('imagen', image);
    formData.append('fecha_inicio', startDate);
    formData.append('fecha_fin', endDate);

    const token = this.authService.getToken();
    if (token) {
      formData.append('token', token);
    }  

    return this.http.post(`${this.apiUrl}/admin/carrousel`, formData);
  }

  getImagesForCarousel(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/carrousel-images`, { headers: this.getHeaders() });
}

  getAllImagesForCarousel(): Observable<any> {
  return this.http.get(`${this.apiUrl}/admin/carrousel-images/all`, { headers: this.getHeaders() });
}

  eliminarImagen(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/admin/eliminar-carrousel/${id}`, { headers: this.getHeaders() });
}
  
}
