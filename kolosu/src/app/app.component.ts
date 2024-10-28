import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles:[`    /* Estilos generales para el cuadro de confirmación */
    :host ::ng-deep .p-confirm-dialog {
        max-width: 600px; /* Ancho máximo para el modo web normal */
        margin: auto; /* Centrar el diálogo */
    }

    /* Ajustes para dispositivos móviles */
    @media (max-width: 768px) {
        :host ::ng-deep .p-confirm-dialog {
            max-width: 90vw; /* Ancho máximo para móviles */
            width: 100%; /* Asegurarse de que ocupe el 100% del contenedor */
        }
        
        :host ::ng-deep .p-confirm-dialog .p-dialog-footer {
            display: flex;
            justify-content: space-between; /* Alinear botones a los lados */
            flex-wrap: wrap; /* Permitir que los botones se envuelvan si es necesario */
        }
        
        :host ::ng-deep .p-confirm-dialog .p-button {
            flex: 1 1 45%; /* Hacer que los botones sean un 45% del ancho del contenedor */
            margin: 0.5em; /* Espaciado entre botones */
        }
    }
  `]
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
