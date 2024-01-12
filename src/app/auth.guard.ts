import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Obtener roles del usuario desde el servicio de autenticación
    const userRoles = this.authService.getRole();

    // Imprimir en la consola los roles del usuario
    console.log('Roles del usuario:', userRoles);

    // Obtener los roles esperados de la ruta
    const expectedRoles = (route.data as { expectedRoles?: string[] })?.expectedRoles;

    // Verificar si expectedRoles está definido y no es nulo
    if (!expectedRoles || expectedRoles.length === 0) {
      console.error('Los roles esperados no están definidos o es un arreglo vacío.');
      return false;
    }

    // Imprimir en la consola los roles esperados
    console.log('Roles esperados:', expectedRoles);

    // Verificar si el usuario está autenticado y tiene al menos uno de los roles esperados
    if (!this.authService.isAuthenticated() || !this.checkRoles(userRoles, expectedRoles)) {
      console.log('Acceso denegado. Redirigiendo a /admin/not-authorized');
      this.router.navigate(['/admin/not-authorized']);
      return false;
    }

    // Permitir el acceso si se cumple la condición
    console.log('Acceso permitido.');
    return true;
  }

  private checkRoles(userRoles: string[] | undefined, expectedRoles: string[] | undefined): boolean {
    if (!userRoles || !expectedRoles) {
      return false;
    }

    // Verificar si al menos uno de los roles esperados está presente en los roles del usuario
    return expectedRoles.some(expectedRole => userRoles.includes(expectedRole));
  }
}
