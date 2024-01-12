import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private baseUrl = 'http://127.0.0.1:8000/api/plantillas'; // Reemplaza con la URL de tu API Laravel
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

  storeDocument(selectedPlantilla: string, files?: File[] | undefined, documentData?: any): Observable<any> {
    const formData: FormData = new FormData();
    console.log('Datos recibidos en storeDocument:', selectedPlantilla, files, documentData);

    // Agrega cada archivo al FormData
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append(`files[${i}]`, files[i]);
      }
    }

    // Agrega cada propiedad de documentData al FormData
    for (const key in documentData) {
      if (documentData.hasOwnProperty(key)) {
        formData.append(`document_data[${key}]`, documentData[key]);
      }
    }

    const token = this.authService.getToken();
    if (token) {
      formData.append('token', token);
    }

    return this.http.post(`${this.baseUrl}/${selectedPlantilla}/documentos`, formData);
  }

  
  updateDocument(plantillaName: string, documentId: string, documentData?: any, nuevoArchivo?: File | null, archivosAEliminar?: string[]): Observable<any> {
    const formData: FormData = new FormData();
  
    // Agrega los datos del documento al FormData
    for (const key in documentData) {
      if (documentData.hasOwnProperty(key)) {
        formData.append(`document_data[${key}]`, documentData[key]);
      }
    }
  
    // Agrega el nuevo archivo al FormData
    if (nuevoArchivo) {
      formData.append('nuevo_archivo', nuevoArchivo, nuevoArchivo.name);
    }
  
    // Agrega archivos existentes a eliminar al FormData
    if (archivosAEliminar) {
      archivosAEliminar.forEach((archivo) => {
        formData.append('archivos_a_eliminar[]', archivo);
      });
    }
  
    // Realiza la solicitud utilizando el FormData y los encabezados
    return this.http.post(`${this.baseUrl}/${plantillaName}/documentos/${documentId}`, formData);
  }
  
  
  
  

  getAllDocuments(plantillaName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${plantillaName}/documentos`, { headers: this.getHeaders() });
  }

  
  getColecciones(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/getforDocuments`, { headers: this.getHeaders() });
  }
  // En DocumentosService
eliminarDocumento(plantillaName: string, documentId: string): Observable<string[]> {
  console.log(plantillaName, documentId)
  return this.http.delete<string[]>(`${this.baseUrl}/${plantillaName}/documentos/${documentId}`, { headers: this.getHeaders() });
}

getDocumentoById(plantillaName: string, documentoId: string): Observable<any> {
  const url = `${this.baseUrl}/${plantillaName}/documentos/${documentoId}`;
  return this.http.get(url, { headers: this.getHeaders() });
}

}





