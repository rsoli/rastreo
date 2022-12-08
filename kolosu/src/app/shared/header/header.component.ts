import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  items!: MenuItem[];
  
  ngOnInit(): void {
    this.CargarMenu();
  }

  CargarMenu() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/menu/slider'
      },
      {
        label: 'Sobre nosotros',
        icon: 'pi pi-fw pi-user',
        routerLink: '/menu/sobre_nosotros'
      },
      {
        label: 'Contactos',
        icon: 'pi pi-phone',
        routerLink: '/menu/contacto'
      },
      {
        label: 'Servicio',
        icon: 'pi pi-tags',
        items: [
          {
            label: 'Inteligencia de negocios',
            icon: 'pi pi-chart-bar',
            routerLink: '/menu/inteligencia_negocio'
          },
          {
            label: 'Rastreo satelital',
            icon: 'pi pi-map-marker',
            routerLink: '/menu/rastreo-satelital'
          },
          {
            label: 'Desarrollo de software y asesoria',
            icon: 'pi pi-sun',
            routerLink: '/menu/desarrollo_software'

          },
          {
            label: 'Diseño web',
            icon: 'pi pi-wallet',
            routerLink: '/menu/diseno_web'
          }
        ]
      },
    ];

  }

}
