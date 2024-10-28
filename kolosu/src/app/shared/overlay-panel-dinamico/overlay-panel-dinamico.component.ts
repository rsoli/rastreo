import { Component, EventEmitter, Output, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-overlay-panel-dinamico',
  templateUrl: './overlay-panel-dinamico.component.html',
  styleUrls: ['./overlay-panel-dinamico.component.scss'],
  providers: [MessageService],
})
export class OverlayPanelDinamicoComponent implements OnInit {

  @Input() data: any[] = [];     // Datos de la tabla
  @Input() columns: any[] = [];  // Columnas de la tabla
  @Input() buttons: {name:string, label: string, action: string, icon: string, disabled:boolean, class:string,tooltip:string }[] = [];
  @Input() dismisable:boolean = true; 

  @Output() buttonClick: EventEmitter<{ action: string, rowData: any }> = new EventEmitter();
  @Output() selected = new EventEmitter<any>(); 
  @Output() Unselect = new EventEmitter<any>(); 
  

  @ViewChild('op') overlayPanel!: OverlayPanel; // Para abrir el overlay
  @ViewChild('dt') table!: Table;  // Acceso a la tabla

  globalFilterFields:string[] = [];
  selectedRow: any | null = null;
  

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.globalFilterFields = this.columns.filter(col => col.visibleTable === true).map(col => col.field); 
  }
  // scrollToSelection() {// se hace scroll hasta la seleccion del dispositivo
  //   if (this.selectedRow) {
  //     const selectedIndex = this.data.findIndex(item => item === this.selectedRow);

  //     if (selectedIndex !== -1) {
  //       const itemHeight = 46; // Altura de cada fila, definida en el atributo virtualScrollItemSize
  //       const scrollPosition = selectedIndex * itemHeight;

  //       // Usamos el método scrollTo para movernos a la posición del item seleccionado
  //       this.table.scrollTo({ top: scrollPosition });
  //     }
  //   }
  // }
  scrollToSelection() {
    if (this.selectedRow) {
      const selectedIndex = this.data.findIndex(item => item === this.selectedRow);
  
      if (selectedIndex !== -1) {
        const itemHeight = 46; // Altura de cada fila, definida en el atributo virtualScrollItemSize
        const scrollPosition = selectedIndex * itemHeight;
        // Usamos el método scrollTo para movernos a la posición del item seleccionado
        this.table.scrollTo({ top: scrollPosition });
      }
    }
  }
  onButtonClick(action: string) {

    if (this.selectedRow) {
      this.buttonClick.emit({ action, rowData: this.selectedRow });
    }

  }

  openOverlay(event: Event) {
    this.overlayPanel.toggle(event); // Método para abrir el overlay
  }
  closeOverlay() {
    this.overlayPanel.hide(); // Método para cerrar el overlay
  }
  onRowSelect(event:any){
    this.selected.emit(event.data);
  }
  onRowUnselect(event:any){
    this.Unselect.emit(event.data);
  }
}