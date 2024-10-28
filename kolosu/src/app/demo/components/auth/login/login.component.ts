import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { PrimeNGConfig } from 'primeng/api';
import {Message,MessageService} from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { UsuarioModelo } from '../../modelos/usuario-modelo';
import{LoginService} from '../../../components/servicios/login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
        .loading-indicator {
            position: fixed;
            z-index: 999;
            height: 2em;
            width: 2em;
            overflow: show;
            margin: auto;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            }
            
            /* Transparent Overlay */
            .loading-indicator:before {
            content: '';
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.59);
            
            }
            .loading-text{
                color: black !important;
            }
            .loading-border{
                background-color:white;
                width:310px;
                height:150px;
                z-index:998;
                padding:20px;
                border-radius: 5px;
                border:0;
            }
    `,
    ],
    styleUrls: ['login.component.scss'],
    providers: [MessageService]
})
export class LoginComponent implements OnInit{

    valCheck: string[] = ['remember'];
    msgs1!: Message[];

    form!: FormGroup;
    usuario:any="";
    password:any="";
    loading=false;
    constructor(
        
        public layoutService: LayoutService,
        private messageService: MessageService,
        private primengConfig: PrimeNGConfig,
        private router: Router,
        private usuario_servicio:LoginService,
        
        ) { }

        ngOnInit(): void {
            this.IniciarFormulario();
            
    
            this.primengConfig.ripple = true;
        }

        IniciarSesion(){

            let nuevo_usuario = new UsuarioModelo;
            nuevo_usuario.email=this.form.value.usuario.trim();
            nuevo_usuario.password=this.form.value.password.trim();
            this.msgs1=[];
            this.loading=true;
            this.usuario_servicio.post_iniciar_sesion(nuevo_usuario).subscribe(data=>{
                // this.closeLoading();
                localStorage.removeItem("accesos");
                localStorage.setItem('accesos', JSON.stringify(data)); 
                this.form.reset();
                //console.log("LLEGO",data);
                this.loading=false;
                // this.persona_label=JSON.parse(localStorage.getItem('accesos')|| '{}').usuario.persona;
                // this.correo_label=JSON.parse(localStorage.getItem('accesos')|| '{}').usuario.correo;
                this.router.navigate(['/rastreo/monitoreo_vehiculo']); 
              },
              error=>{
                this.loading=false;
                  try {
                    this.error("error","Error","Usuario o contraseña incorrecta");   
                  } 
                  catch (error) {
                    this.error("error","Error","Contactese con el administrador");
                  } 
              })
            
            
            // this.router.navigate(['/rastreo/monitoreo']); 
            
        }
        CancelarSesion(){
            console.log("LLEGO CANCELAR");
        }
        IniciarFormulario(){
            console.log("LLEGO formulario");
            this.form = new FormGroup({
                usuario: new FormControl(this.usuario, [Validators.required,Validators.maxLength(40)]),
                password: new FormControl(this.password, [Validators.required, Validators.maxLength(40)]),
            });
           //  console.log("ver log ",this.form.controls.usuario.errors);
        }
        error(tipo_mensaje:string,titulo:string,mensaje:string) {
            this.msgs1 = [
                
                {severity:tipo_mensaje, summary:titulo, detail:mensaje}
            ];
            // this.msgs1=[];
            
            // this.form.reset();
            // this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
        }
}
