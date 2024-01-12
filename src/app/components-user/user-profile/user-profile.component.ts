import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any; // Objeto para almacenar la información del usuario
  editingMode = false;
  editedValues: any = {
    ocupacion: '',        // Inicializar ocupacion
    ocupacionOtro: ''      // Inicializar ocupacionOtro
  };

  ocupacionOptions: string[] = ['Estudiante', 'Profesor', 'Desempleado', 'Otro'];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(
      (response: any) => {
        this.user = response.user;

        // Inicializar los valores editables con los valores actuales del usuario
        this.editedValues = { ...this.user };
        if (!this.ocupacionOptions.includes(this.editedValues.ocupacion)) {
          this.ocupacionOptions.push(this.editedValues.ocupacion);
        }
      },
      (error) => {
        console.error('Error al obtener el perfil del usuario', error);
      }
    );
  }

  enterEditMode() {
    this.editingMode = true;
  }

  exitEditMode() {
    this.editingMode = false;
  }

  saveChanges() {
    if (this.editedValues.ocupacion === 'Otro') {
      // Usar el valor personalizado ingresado por el usuario
      this.editedValues.ocupacion = this.editedValues.ocupacionOtro;
    }
    // Llamada al servicio para actualizar el perfil del usuario
    this.authService.updateUserProfile(this.user._id, this.editedValues).subscribe(
      (response) => {
        // Manejar la respuesta exitosa, si es necesario
        console.log('Perfil actualizado exitosamente', response);

        // Actualizar el objeto del usuario con los valores editados
        this.user = { ...this.editedValues };

        // Salir del modo de edición después de guardar
        this.exitEditMode();
      },
      (error) => {
        // Manejar el error, si es necesario
        console.error('Error al actualizar el perfil del usuario', error);
      }
    );
  }
}