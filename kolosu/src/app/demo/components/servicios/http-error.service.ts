import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private confirmationService: ConfirmationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!navigator.onLine) {
          this.showConfirmationDialog('No tienes conexión a Internet. ¿Deseas intentar reconectar?');
        }/* else if (error.status === 0) {
          this.showConfirmationDialog('Hubo un problema de red. ¿Deseas intentar nuevamente?');
        } else {
          this.showConfirmationDialog(`Ocurrió un error HTTP: ${error.message}. ¿Deseas intentar nuevamente?`, error.status);
        }*/
        return throwError(() => new Error(error.message || 'Error HTTP'));
      })
    );
  }

  private showConfirmationDialog(message: string, status?: number) {
    this.confirmationService.confirm({
      message: message,
      header: status ? `Error ${status}` : 'Conexión perdida',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectVisible: false, // Ocultar el botón de rechazo si se desea
      accept: () => {
        // Recargar la página cuando el usuario acepta
        window.location.reload();
      },
      reject: (type:any) => {
        window.location.reload();
      }
    });

  }
}
