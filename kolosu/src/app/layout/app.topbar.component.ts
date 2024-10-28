import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import{LoginService} from '../demo/components/servicios/login.service';
import{AppMenuComponent} from '../layout/app.menu.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [AppMenuComponent],
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    isLogin=false;
    usuario='';
    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private usuario_servicio:LoginService,
        private sidebar:AppMenuComponent
        ) {
        this.session();
 
    }
    session(){
        //this.usuario_servicio.isLogin();
        this.isLogin=this.usuario_servicio.isLogin();
        this.usuario=this.usuario_servicio.getUser();

        // if(localStorage.getItem('accesos') == undefined ){
        //     this.router.navigate(['/public/inicio']);   
        //     console.log("llego 1");
            
        // }else{
        //     console.log("llego 2");
        // }
    }
    serrarSesion(){
        // let nuevo_usuario = new UsuarioModelo;
        // nuevo_usuario.email=this.form.value.usuario.trim();
        // nuevo_usuario.password=this.form.value.password.trim();
        // this.msgs1=[];
        // this.loading=true;
        this.usuario_servicio.post_cerrar_sesion().subscribe(data=>{
            // this.closeLoading();
            localStorage.removeItem("accesos");
            // localStorage.setItem('accesos', JSON.stringify(data)); 
            // this.form.reset();
            //console.log("LLEGO",data);
            // this.loading=false;
            // this.persona_label=JSON.parse(localStorage.getItem('accesos')|| '{}').usuario.persona;
            // this.correo_label=JSON.parse(localStorage.getItem('accesos')|| '{}').usuario.correo;
            this.sidebar.ngOnInit();
            this.router.navigate(['/auth/login']); 
          },
          error=>{
            console.log("error ",error);
             
          })
        
    }
}
