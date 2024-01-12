   import { Component, OnInit } from '@angular/core';
   import { AuthService } from 'src/app/services/auth.service';
   import { FormBuilder, FormGroup, Validators } from '@angular/forms';
   import {  Router } from '@angular/router';
   import Swal from 'sweetalert2';

   @Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
   })
   export class LoginComponent implements OnInit {
    

   loginForm: FormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
   });

   constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

   ngOnInit() {
      // Puedes realizar algunas inicializaciones adicionales si es necesario
   }



   loginUser() {
  if (this.loginForm.valid) {
    const loginData = this.loginForm.value;

    // Validar si los campos de email y contraseña están vacíos
    if (!loginData.email || !loginData.password) {
      // Mostrar alerta indicando que los campos son obligatorios
      
    }

    // Continuar con la autenticación
    this.authService.loginUser(loginData).subscribe(
      response => {
        console.log(response);
        // Actualizar el estado de autenticación utilizando el método público
        this.authService.setAuthenticated(true);
        // Actualizar el nombre de usuario
        this.authService.checkAuthentication();
        this.router.navigate(['user/home-user']);
      },
      error => {
        console.error(error);
        this.showLoginErrorAlert();
      }
    );
  } else {
    // Mostrar alerta indicando que hay campos inválidos
    this.showValidationAlert('Por favor, completa todos los campos correctamente.');
  }
}

showValidationAlert(message: string) {
  Swal.fire({
    icon: 'warning',
    text: message,
    confirmButtonColor: '#3085d6', // Cambia el color del botón principal

  });
}


    showLoginErrorAlert() {
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: 'Usuario o contraseña incorrectos',
        confirmButtonColor: '#3085d6', // Cambia el color del botón principal
        cancelButtonColor: '#d33', // Cambia el color del botón de cancelar (si es una alerta con botones de confirmar y cancelar)
        confirmButtonText: 'Aceptar' // Cambia el texto del botón principal
      }).then((result) => {
        // Código que se ejecuta después de que se hace clic en el botón
        if (result.isConfirmed) {
          // Código si se hizo clic en "Aceptar"
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Código si se hizo clic en "Cancelar"
        }
      });
    }      


}