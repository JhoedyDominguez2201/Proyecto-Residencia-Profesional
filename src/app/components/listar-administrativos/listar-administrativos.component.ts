// listar-administrativos.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-listar-administrativos',
  templateUrl: './listar-administrativos.component.html',
  styleUrls: ['./listar-administrativos.component.css'],
})
export class ListarAdministrativosComponent implements OnInit {
  administrativos: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getAdministrativos();
  }

  getAdministrativos(): void {
    this.authService.getUsersAdministrativos().subscribe(
      (response: any) => {
        this.administrativos = response.users; // Ajusta según la estructura de tu respuesta
      },
      (error) => {
        console.error('Error al obtener administrativos:', error);
      }
    );
  }

  editarAdministrativo(usuarioId: string): void {
    this.router.navigate(['/admin/editar-administrativos', usuarioId]);

  }

  eliminarAdministrativo(usuarioId: string): void {
    this.authService.deleteUser(usuarioId).subscribe(
      (response) => {
        console.log('Usuario eliminado con éxito:', response.message);
        // Actualizar la lista de usuarios después de la eliminación, si es necesario
      },
      (error) => {
        console.error('Error al eliminar usuario:', error);
        // Manejar errores, mostrar mensajes, etc.
      }
    );
}
}
