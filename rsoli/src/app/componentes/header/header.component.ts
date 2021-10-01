import { Component, OnInit } from '@angular/core';
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
              },
              {
                  label:'Misión',
                  icon:'pi pi-fw pi-pencil',
              },
              {
                  label:'Visión',
                  icon:'pi pi-fw pi-user',
              },
              {
                  label:'Contactos',
                  icon:'pi pi-fw pi-calendar',
              },
              {
                label:'Servicio',
                icon:'pi pi-fw pi-calendar',
                items:[
                    {
                        label:'Inteligencia de negocios',
                        icon:'pi pi-fw pi-pencil',
                    },
                    {
                        label:'Rastreo satelital',
                        icon:'pi pi-fw pi-calendar-times',
                    },
                    {
                      label:'Desarrollo de software y asesoria',
                      icon:'pi pi-fw pi-calendar-times',
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
