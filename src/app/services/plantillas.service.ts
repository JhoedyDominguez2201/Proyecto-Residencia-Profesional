import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlantillasService {

  private apiUrl = 'http://127.0.0.1:8000/api/plantillas';
  private headers: HttpHeaders;

  constructor(private http: HttpClient , private authService: AuthService) {
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


  deletePlantilla(plantillaName: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${plantillaName}`;
    return this.http.delete(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  crearPlantilla(solicitud: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, solicitud, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getPlantillas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
  getPlantillasforDocuments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getforDocuments`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updatePlantilla(nombrePlantilla: string, nuevosDatos: any): Observable<any> {
    const url = `${this.apiUrl}/update/${nombrePlantilla}`;
    return this.http.put(url, { fields: nuevosDatos }, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getFields(nombrePlantilla: string): Observable<any> {
    const url = `${this.apiUrl}/${nombrePlantilla}/fields`;
    return this.http.get(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }



  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError(error);
  }


  obtenerPlantillasPredeterminadas(): Observable<any[]> {
    const baseUrl = 'http://127.0.0.1:8000/api'
    const url = `${baseUrl}/obtener-plantillas-predeterminadas`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }
}


