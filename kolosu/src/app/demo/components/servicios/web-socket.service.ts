import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { BehaviorSubject, Observable, Subject, throwError, timer } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket$!: WebSocketSubject<any>;
  private readonly url = 'wss://www.kolosu.com/traccar/api/socket';



  private retryCount = 0; // Contador de intentos de reconexión
  private readonly maxRetries = 5; // Número máximo de intentos de reconexión
  private connectionErrorSubject = new Subject<void>(); // Subject para errores de conexión
  private connectionStatusSubject = new BehaviorSubject<boolean>(false); // Estado de la conexión
  private hasConnectedOnce = false; // Flag para emitir solo una vez

  constructor() {}

  /*public connect(): Observable<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
    }
    return this.socket$.pipe(
      catchError(err => {
        console.error('Socket error: ', err);
        // Emitir un error y esperar antes de reconectar
        return timer(2000).pipe(switchMap(() => this.connect())); // Reconectar después de 2 segundos
      })
    );
  }*/

  /*
  public connect(): Observable<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
    }
    return this.socket$.pipe(
      catchError(err => {
        // console.error('Socket error: ', err);
        // console.log('Socket error: ',err);
        
        // Calcular el tiempo de espera exponencial
        const waitTime = Math.min(2000 * Math.pow(2, this.retryCount), 30000); // Aumenta hasta un máximo de 30 segundos
        console.log("tiempo de espera ",waitTime);
        
        // Incrementar el contador de intentos
        this.retryCount++;
        
        // Si se han alcanzado los intentos máximos, lanzar un error y emitir el evento
        if (this.retryCount > this.maxRetries) {
          this.connectionErrorSubject.next(); // Emitir el evento
          // throw new Error('Maximum reconnection attempts exceeded');
          // console.log('Maximum reconnection attempts exceeded');
          
        }
        
        // Esperar antes de intentar reconectar
        return timer(waitTime).pipe(switchMap(() => this.connect()));
      }),
      tap(() => {
        // Reiniciar el contador de intentos si la conexión es exitosa
        this.retryCount = 0;
        // Solo emitir una vez que la conexión fue exitosa
        if (!this.hasConnectedOnce) {
          this.hasConnectedOnce = true; // Marcar que la conexión ya fue exitosa
          this.connectionStatusSubject.next(true); // Emitir true una sola vez
        }
        
      })
    );
  }*/
  public connect(): Observable<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
    }
    return this.socket$.pipe(
      catchError(err => {
        console.error('Error en el WebSocket:', err);
  
        // const waitTime = Math.min(2000 * Math.pow(2, this.retryCount), 30000);
        const waitTime = Math.min(this.retryCount * 1000, 5000);
        console.log("tiempo de conexion ",waitTime);
        
        this.retryCount++;
  
        // Si se han alcanzado los intentos máximos, lanzar un error y no reconectar
        if (this.retryCount > this.maxRetries) {
          this.connectionErrorSubject.next();
          this.connectionStatusSubject.next(false); // Emitir false para indicar que la conexión falló
  
          // Aquí retornamos un error y ya no llamamos de nuevo a `connect()` 
          return throwError(() => new Error('Máximo de intentos de reconexión alcanzado')); // esto hace que no vuelva a intentar
        }
  
        this.connectionStatusSubject.next(false); // Emitir false si hay un error
        return timer(waitTime).pipe(switchMap(() => this.connect()));
      }),
      tap(() => {
        this.retryCount = 0;
  
        // Verificar que el estado anterior sea false para emitir true solo una vez
        if (!this.connectionStatusSubject.value) {
          this.connectionStatusSubject.next(true); // Emitir true cuando la conexión sea exitosa solo una vez
        }
      })
    );
  }
  
  private getNewWebSocket(): WebSocketSubject<any> {
    return webSocket(this.url);
  }

  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  // public close(): void {
  //   this.socket$.complete();
  // }
  public close(): void {
    if (this.socket$) {
      this.socket$.complete();
      console.log('WebSocket cerrado');
    }
  }
  public isConnected(): boolean {
    return this.socket$ ? this.socket$.closed === false : false;
  }
  public ReiniciarContadorManual(){
    this.retryCount = 0;
  }


  // agregao recientemente para emitir el numero de intentos al componente
  // Método para obtener el Subject de error de conexión
  public getConnectionErrorObservable(): Observable<void> {
    return this.connectionErrorSubject.asObservable();
  }
  // Método para obtener el estado de la conexión (éxito o fallo)
  public getConnectionStatusObservable(): Observable<boolean> {
    return this.connectionStatusSubject.asObservable();
  }

}


