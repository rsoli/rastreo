import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfirmationService } from 'primeng/api';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private offline$ = new BehaviorSubject<boolean>(false);
  constructor(private confirmationService: ConfirmationService) {
    // Suscribirse a eventos de cambio de conectividad del navegador
    window.addEventListener('offline', () => this.handleConnectionLost());
    window.addEventListener('online', () => this.handleConnectionRestored());
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el dispositivo está desconectado y aún no se ha mostrado el diálogo
        if (!navigator.onLine && !this.offline$.value) {
          this.offline$.next(true); // Cambiar el estado a "sin conexión"
          this.showConfirmationDialog('No tienes conexión a Internet. ¿Deseas intentar reconectar?');
        }
        return throwError(() => new Error(error.message || 'Error HTTP'));
      })
    );
  }
  private handleConnectionLost() {
    // Al perder conexión, mostrar el diálogo si aún no se ha mostrado
    if (!this.offline$.value) {
      this.offline$.next(true);
      this.showConfirmationDialog('No tienes conexión a Internet. ¿Deseas intentar reconectar?');
    }
  }
  private handleConnectionRestored() {
    // Actualizar el estado al recuperar conexión
    if (this.offline$.value) {
      this.offline$.next(false);
    }
  }
  private showConfirmationDialog(message: string) {
    this.confirmationService.confirm({
      message: message,
      header: 'Conexión perdida',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectVisible: false,
      accept: () => {
        // Recargar la página solo si el usuario acepta
        window.location.reload();
      }
    });
  }
}
