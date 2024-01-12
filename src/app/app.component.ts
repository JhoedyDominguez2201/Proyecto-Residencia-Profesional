import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular-acervo';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Verificar autenticación al cargar la aplicación
    this.authService.checkAuthentication();
  }
}
