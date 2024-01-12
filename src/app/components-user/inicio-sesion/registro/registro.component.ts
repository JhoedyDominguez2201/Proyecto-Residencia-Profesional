import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class UserRegisterComponent implements OnInit {
  registerForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido_paterno: ['', Validators.required],
    apellido_materno: ['', Validators.required],
    edad: ['', Validators.required],
    estado: ['', Validators.required],
    ocupacion: ['', Validators.required],
    escolaridad: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]], // Corregido aquí
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordMatchValidator });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    // Puedes realizar algunas inicializaciones adicionales si es necesario
  }

  registerUser() {

    // Verificar si hay campos vacíos antes de continuar
    if (this.hasEmptyFields()) {
      this.showValidationAlert('Por favor, completa todos los campos.');
      return;
    }

    // Verificar si las contraseñas coinciden
    if (this.registerForm.hasError('passwordMismatch')) {
      this.showValidationAlert('Las contraseñas no coinciden.');
      return;
    }

    // Verificar si el formato del correo electrónico es correcto
    if (this.registerForm.get('email')?.hasError('email')) {
      this.showValidationAlert('El formato del correo electrónico no es válido.');
      return;
    }

    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this.authService.registerUser(userData).subscribe(
        response => {
          console.log("usuario creado con exito" ,response);
          Swal.fire({
              text: "Usuario creado con exito",
              icon: "success",
              confirmButtonColor: "#3085d6",
            }).then(() => {
              // Ejecutar location.reload() después de hacer clic en "Aceptar"
              this.router.navigate(['user/login']);
            });
          // Puedes redirigir o realizar otras acciones después del registro exitoso
        },
        error => {
          Swal.fire({
            text: "El email ya existe",
            icon: "error",
            confirmButtonColor: "#3085d6",
          })
          console.error(error);
          // Manejar errores, por ejemplo, mostrar un mensaje al usuario
        }
      );
    }
  }

  private passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Verificar si las propiedades son distintas de null antes de comparar
    return password !== null && confirmPassword !== null && password === confirmPassword
      ? null
      : { 'passwordMismatch': true };
  }
  
  private hasEmptyFields(): boolean {
    // Verificar si algún campo del formulario está vacío
    return Object.values(this.registerForm.value).some(value => value === '' || value === null);
  }
showValidationAlert(message: string) {
    Swal.fire({
      icon: 'warning',
      text: message,
      confirmButtonColor: '#3085d6', // Cambia el color del botón principal

    });
  }
}
