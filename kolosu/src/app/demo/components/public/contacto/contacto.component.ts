import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent {
  openWhatsApp() {
    const phoneNumber = '59172276601'; // Cambia esto por el número de teléfono deseado
    const message = 'Hola, me gustaría más información.'; // Mensaje predeterminado
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
  openLink(url: string) {
    window.open(url, '_blank');
  }
}
