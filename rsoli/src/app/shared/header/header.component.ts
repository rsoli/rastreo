import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  items!: MenuItem[];
  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.CargarMenu();
    this.primengConfig.ripple = true;
  }
  CargarMenu(){
    this.items = [
              {
                  label:'Inicio',
                  icon:'pi pi-fw pi-file', 
                  routerLink:'slider'
              },
              {
                  label:'Misión',
                  icon:'pi pi-fw pi-pencil',
                  routerLink:'mision'
              },
              {
                  label:'Visión',
                  icon:'pi pi-fw pi-user',
                  routerLink:'vision'
              },
              {
                  label:'Contactos',
                  icon:'pi pi-fw pi-calendar',
                  routerLink:'contacto'
              },
              {
                label:'Servicio',
                icon:'pi pi-fw pi-calendar',
                items:[
                    {
                        label:'Inteligencia de negocios',
                        icon:'pi pi-fw pi-pencil',
                        routerLink:'inteligencia-negocios'
                    },
                    {
                        label:'Rastreo satelital',
                        icon:'pi pi-fw pi-calendar-times',
                        routerLink:'rastreo-satelital'
                    },
                    {
                      label:'Desarrollo de software y asesoria',
                      icon:'pi pi-fw pi-calendar-times',
                      routerLink:'desarrollo-software'

                    },
                    {
                      label:'Diseño web',
                      icon:'pi pi-fw pi-calendar-times',
                    }
                ]
            },
          ];

    }
}
