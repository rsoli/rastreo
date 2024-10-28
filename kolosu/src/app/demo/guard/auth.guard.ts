import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { log } from 'console';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Verificar si el usuario está autenticado
    if (localStorage.getItem('accesos') !== null) {
      // El usuario está autenticado, permitir el acceso
      console.log("Sesion logueada");
      return true;

    } else {
      // El usuario no está autenticado, redirigir a la página de inicio
      this.router.navigate(['/public/inicio']);
      console.log("Redirigido a la página de inicio");
      return false;
    }
  }
}
