import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  loginAdmin() {
    const loginData = this.loginForm.value;

    this.authService.loginAdmin(loginData).subscribe(
      response => {
        console.log('Inicio de sesión exitoso:', response);
        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        }).fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso'
        }).then(() => {
          // Redirigir al componente de administradores después de cerrar la alerta
          window.location.href = '/admin/home-admin';
        });
      },
      error => {
        console.error('Error en el inicio de sesión:', error);
        // Puedes mostrar un mensaje de error o hacer algo más aquí
      }
    );
  }

 
}

