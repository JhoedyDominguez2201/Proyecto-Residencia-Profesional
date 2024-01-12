// editar-administrativos.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-editar-administrativos',
  templateUrl: './editar-administrativos.component.html',
  styleUrls: ['./editar-administrativos.component.css'],
})
export class EditarAdministrativosComponent implements OnInit {
  usuario: any = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    password: '',
    role: [], // Inicializa roles como un array vacío

  };
  usuarioRoles: any = {};

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuarioId = this.route.snapshot.params['id'];

    this.authService.getUserById(usuarioId).subscribe(
      (response) => {
        this.usuario = response.user;
        // Inicializa el objeto de roles con los roles existentes del usuario
      this.usuarioRoles = {};
      for (const rol of this.usuario.role) {
        this.usuarioRoles[rol.toLowerCase()] = true;
      }
        console.log(this.usuario);
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }




  guardarCambios(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres actualizar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        // Resto del código para capitalizar los roles y realizar la actualización
        const rolesCapitalized = Object.keys(this.usuarioRoles)
          .filter(role => this.usuarioRoles[role])
          .map(role => role.charAt(0).toUpperCase() + role.slice(1));
  
        this.usuario.role = rolesCapitalized;
        this.usuario.current_email = this.usuario.email;

        // Realiza la actualización directamente pasando el usuario actualizado
        this.actualizarUsuario(this.usuario);
      }
    });
  }
  
  actualizarUsuario(usuarioActualizado: any): void {
    // Aquí colocas la lógica para realizar la actualización del usuario
    // Puedes llamar a tu servicio para actualizar el usuario
    this.authService.updateUser(usuarioActualizado._id, usuarioActualizado).subscribe(
      (response) => {
        Swal.fire({
          title: 'Actualizado',
          text: 'El usuario se ha actualizado exitosamente.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.router.navigate(['/admin/listar-administrativos']);
        });
      },
      (error) => {
        console.error('Error al actualizar usuario:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al actualizar el usuario.',
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });
      }
    );
  }
}  