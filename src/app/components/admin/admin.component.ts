import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService} from 'src/app/services/auth.service';
import { NotificacionService } from 'src/app/notificacion.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  title = 'Angular-acervo';
  isAuthenticated$: Observable<boolean>;
  userName$: Observable<string>;
  mensajeError: string | null = null; // Agrega esta línea

  constructor(private router: Router, private authService: AuthService,  private notificationService: NotificacionService){
    this.isAuthenticated$ = new Observable<boolean>();
    this.userName$ = new Observable<string>();

  }

  ngOnInit(): void {
    // Lógica de inicialización que puedes agregar si es necesario
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated$ = of(isAuthenticated); // Importa 'of' desde 'rxjs' si aún no lo has hecho
    });

    this.notificationService.notificacion$.subscribe((errorMessage) => {
      // Puedes abrir tu componente modal aquí o tomar otras acciones
      console.error(errorMessage);
    });
  }
  
    irDocumentos() {
      this.router.navigate(['admin/listar-documentos']); // Ajusta la ruta según tu estructura de rutas
    }

    irCrearDocumentos() {
      this.router.navigate(['admin/crear-documento']); // Ajusta la ruta según tu estructura de rutas
    }

    irCrearPlantilla(){
        this.router.navigate(['admin/crear-plantilla']);
      }
    
    

    irConsultarPlantillas(){
      this.router.navigate(['admin/listar-plantillas']); // Ajusta la ruta según tu estructura de rutas

    }

    IrCrearDesdeExistente(){
      this.router.navigate(['admin/crear-plantilla-seleccion']); // Ajusta la ruta según tu estructura de rutas
    }

    
    IrComentarios(){
      this.router.navigate(['admin/comentarios']); // Ajusta la ruta según tu estructura de rutas
    }

    
    IrUsuarios(){
      this.router.navigate(['admin/usuarios']); // Ajusta la ruta según tu estructura de rutas
    }
    
    IrCarrusel(){
      this.router.navigate(['admin/carrusel']); // Ajusta la ruta según tu estructura de rutas
    }

    IrIniciarSesion(){
      this.router.navigate(['admin/admin-login']); // Ajusta la ruta según tu estructura de rutas

    }
    irListarUsuarios(){
      this.router.navigate(['admin/listar-administrativos']); // Ajusta la ruta según tu estructura de rutas

    }

    logout(): void {
      this.authService.clearToken();
      this.authService.clearRole();
      // Recargar y redirigir a otra ruta
      window.location.href = 'admin/admin-login';


    }
  
    handleUnauthorizedError(): void {
      this.mensajeError = 'Acceso no autorizado';
    }
 }


