// user.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { UserDocumentosService } from 'src/app/services/user-documentos.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  userName$: Observable<string>;
  resultados: any[] = []; // Agregar esta línea para la propiedad resultados
  userId$: Observable<string>;


  constructor(private authService: AuthService, private userDocumentosService: UserDocumentosService, private router: Router) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.userName$ = this.authService.userName$;
    
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.userId$ = this.authService.userName$;
    
  }
  ngOnInit() {
    this.authService.checkAuthentication();
  }


  logout() {
    window.location.reload();
    this.authService.clearToken();
  }

  buscarDocumentos(palabraClave: string): void {
    Swal.fire({
      title: 'Buscando documentos',
      html: 'Estamos buscando documentos, por favor espera...',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.userDocumentosService.buscarPorPalabraClave(palabraClave)
      .subscribe(
        (resultados) => {
          Swal.close();
          // Manejar los resultados de la búsqueda aquí
          this.resultados = resultados;
          console.log(this.resultados);
          this.router.navigate(['/user/busqueda-sencilla'], { queryParams: { resultados: JSON.stringify(resultados) } });
        },
        (error) => {
          // Manejar errores aquí
          console.error(error);
        }
      );
    }
  }


  

  


  
