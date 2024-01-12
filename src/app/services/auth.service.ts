// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Puedes ajustar el tipo según la estructura de tus datos

  private apiUrl = 'http://127.0.0.1:8000/api';
  private tokenKey = 'auth-token';
  private roleKey = 'auth-role'; // Agregar esta línea para la clave del rol

  private roleSubject = new BehaviorSubject<string>('');
  role$ = this.roleSubject.asObservable();


  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();

  
  private userIdSubject = new BehaviorSubject<string>('');
  userId$ = this.userIdSubject.asObservable();

  private userFullNameSubject = new BehaviorSubject<string>('');
  userFullName$ = this.userFullNameSubject.asObservable();

  constructor(private http: HttpClient) { }

  // En tu servicio AuthService
  getRole(): string[] {
    const storedRole = localStorage.getItem(this.roleKey);
    return storedRole ? storedRole.split(',') : [];
  }
  

  // Nuevo método para actualizar el BehaviorSubject del rol
  setRole(role: string | null): void {
    this.roleSubject.next(role || ''); // Usar una cadena vacía si el valor es nulo
  }

  // Nuevo método para limpiar el BehaviorSubject del rol
  clearRole(): void {
    this.roleSubject.next('');
  }


getUserById(userId: string): Observable<any> {
  const url = `${this.apiUrl}/user/${userId}`;
  const headers = this.getHeaders();

  return this.http.get(url, { headers });
}

  registerUser(userData: any): Observable<any> {
    const url = `${this.apiUrl}/user/register`;
    return this.http.post(url, userData);
  }

  adminRegister(userData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/admin/register`; // Ajusta la ruta según tu API
    return this.http.post(url, userData, { headers });
  }

  loginUser(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, loginData)
      .pipe(
        tap((response: any) => {
          const token = response.token;
          localStorage.setItem(this.tokenKey, token);
          this.setAuthenticated(true);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserProfile(): Observable<any> {
    const url = `${this.apiUrl}/user/profile`;
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Headers:', headers);
  
    return this.http.get(url, { headers })
      .pipe(
        tap((response: any) => {
          // Asegúrate de que la información del usuario está presente en la respuesta
          const user = response?.user || {};
          
          // Actualiza el nombre de usuario en el servicio
          const userName = user.nombre || '';
          this.userNameSubject.next(userName);

          // Actualiza el nombre completo del usuario en el servicio
          const fullName = this.buildFullName(user);
          this.userFullNameSubject.next(fullName);
          
          // Puedes agregar más propiedades según tu estructura de usuario
          // Por ejemplo, si el ID del usuario está presente en la respuesta,
          // puedes emitirlo a través de un BehaviorSubject o devolverlo en el Observable
          const userId = user.id || '';
          // Emitir el ID del usuario a través de un BehaviorSubject
          this.userIdSubject.next(userId);
                console.log('User Profile Response:', response);
        }), 
      );
  }
  


  private buildFullName(user: any): string {
    // Puedes ajustar esto según la estructura de tu usuario
    const nombre = user.nombre || '';
    const apellidoPaterno = user.apellido_paterno || '';
    const apellidoMaterno = user.apellido_materno || '';

    return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
  }
  

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.setAuthenticated(false);
    this.userNameSubject.next('');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Método público para establecer el estado de autenticación
  setAuthenticated(value: boolean): void {
    this.isAuthenticatedSubject.next(value);
  }

  checkAuthentication(): void {
    const isAuthenticated = this.isAuthenticated();
    this.setAuthenticated(isAuthenticated);
  
    if (isAuthenticated) {
      this.getUserProfile().subscribe(
        (response: any) => {
          const userName = response?.user?.nombre || '';
          const userId = response?.user?._id || ''; // Asegúrate de cambiar esto con la propiedad correcta del usuario
          this.userIdSubject.next(userId); // Emite el userId
          this.userNameSubject.next(userName);
        },
        error => {
          console.error(error);
        }
      );
    }
    
  }
  
  loginAdmin(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, loginData)
      .pipe(
        tap((response: any) => {
          const token = response.token;
          const role = response.role; // Nueva línea para extraer el rol
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem(this.roleKey, role); // Almacena el rol en el cliente
          this.setAuthenticated(true);
          this.setRole(role); // Método adicional para actualizar el BehaviorSubject del rol
        })
      );
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getUsersAdministrativos(): Observable<any> {
    const url = `${this.apiUrl}/get-users-administrativos`;
    const headers = this.getHeaders();

    return this.http.get(url, { headers });
  }

  // auth.service.ts

  deleteUser(userId: string): Observable<any> {
    const url = `${this.apiUrl}/usuarios/${userId}`;
    const headers = this.getHeaders();
  
    return new Observable((observer) => {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.delete(url, { headers }).subscribe(
            (response) => {
              // Muestra la alerta de éxito
              Swal.fire({
                title: 'Eliminado',
                text: 'El usuario se ha eliminado exitosamente.',
                icon: 'success',
                confirmButtonColor: '#3085d6'
              }).then(() => {
                // Recarga la página después de hacer clic en "Aceptar" en la alerta de éxito
                window.location.reload();
              });
  
              // Puedes realizar cualquier otra acción necesaria después de eliminar el usuario
              observer.next(response);
              observer.complete();
            },
            (error) => {
              console.error('Error al eliminar el usuario', error);
              // Maneja errores según sea necesario
              observer.error(error);
            }
          );
        } else {
          observer.complete();
        }
      });
    });
  }

  // AuthService

updateUser(userId: string, userData: any): Observable<any> {
  const url = `${this.apiUrl}/usuarios/${userId}`;
  const headers = this.getHeaders();

  return this.http.put(url, userData, { headers });
}

updateUserProfile(userId: string, updatedData: any): Observable<any> {
  const url = `${this.apiUrl}/users/edit/${userId}`;
  const headers = this.getHeaders();

  return this.http.put(url, updatedData, { headers });
}

}