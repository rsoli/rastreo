import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { PrimeNGConfig, MessageService, Message } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModelo } from '../../modelos/usuario-modelo';
import { LoginService } from '../../../components/servicios/login.service';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  msgs1: Message[] = [];
  loading = false;

  constructor(
    public layoutService: LayoutService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private usuario_servicio: LoginService
  ) {}

  ngOnInit(): void {
    this.iniciarFormulario();
    this.primengConfig.ripple = true;
  }

  iniciarFormulario() {
    this.form = new FormGroup({
      usuario: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(40)])
    });
  }
  
  IniciarSesion() {
    if (this.form.invalid) {
      this.mostrarMensaje('error', 'Error', 'Por favor, complete todos los campos.');
      return;
    }

    this.loading = true;
    const nuevo_usuario = new UsuarioModelo();
    nuevo_usuario.email = this.form.value.usuario.trim();
    nuevo_usuario.password = this.form.value.password.trim();

    this.usuario_servicio.post_iniciar_sesion(nuevo_usuario).pipe(
      timeout(5000), // Timeout de 5 segundos para evitar demoras
      catchError(error => {
        this.mostrarMensaje('error', 'Error', 'Usuario o contraseña incorrecta');
        return of(null); // Devuelve un observable nulo para detener el flujo
      }),
      finalize(() => (this.loading = false)) // Finaliza el indicador de carga independientemente del resultado
    ).subscribe(data => {
      if (data) {
        localStorage.setItem('accesos', JSON.stringify(data));
        this.form.reset();
        //this.router.navigate(['/rastreo/monitoreo_vehiculo']); 
        this.router.navigateByUrl('/rastreo/monitoreo_vehiculo');
      }
    });
  }

  mostrarMensaje(severity: string, summary: string, detail: string) {
    this.msgs1 = [{ severity, summary, detail }];
  }
}
