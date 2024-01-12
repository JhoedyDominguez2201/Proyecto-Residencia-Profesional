import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrativos',
  templateUrl: './administrativos.component.html',
  styleUrls: ['./administrativos.component.css']
})
export class AdministrativosComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) {
    this.registerForm = this.fb.group({
      nombre: [null, Validators.required],
      apellidoPaterno: [null, Validators.required],
      apellidoMaterno: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      roleAdmin: [false],
      roleCapturista: [false],
      roleValidador: [false],
      roleCarrusel: [false],
      rolePlantillas: [false]    
    });
  }

  registerUserAdmin() {
    const formData = this.registerForm.value;
  
    const roles = [
      formData.roleAdmin ? 'Admin' : '',
      formData.roleCapturista ? 'Capturista' : '',
      formData.roleValidador ? 'Validador' : '',
      formData.roleCarrusel ? 'Carrusel' : '',
      formData.rolePlantillas ? 'Plantillas' : ''
    ].filter(role => role !== '');  // Filtra roles vacíos
  
    console.log(roles);
  
    const requestBody = {
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      role: roles,
      nombre: formData.nombre,
      apellido_paterno: formData.apellidoPaterno,
      apellido_materno: formData.apellidoMaterno
    };
  
    console.log(requestBody);
  
  
        this.authService.adminRegister(requestBody).subscribe(
      response => {
        console.log('Registro exitoso:', response);
        Swal.fire({
          text: "Usuario creado con exito",
          icon: "success",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          // Ejecutar location.reload() después de hacer clic en "Aceptar"
          window.location.reload();
        });
        // Puedes redirigir a otra página o mostrar un mensaje de éxito aquí
      },
      error => {
        console.error('Error en el registro:', error);
        // Puedes mostrar un mensaje de error o hacer algo más aquí
      }
    );
  }
  }
