import { Component,EventEmitter,Input, Output,OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Asegúrate de que esto esté correctamente importado
import autoTable from 'jspdf-autotable';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-reporte-modal-dinamica',
  templateUrl: './reporte-modal-dinamica.component.html',
  styleUrls: ['./reporte-modal-dinamica.component.scss']
})
export class ReporteModalDinamicaComponent implements OnInit {

  @Input() columns: any[] = [];  // Columnas de la tabla
  @Input() data: any[] = [];     // Datos de la tabla
  @Input() modalVisible: boolean = false;     // Datos de la tabla
  @Input() titleModal: string = '';
  @Input() subtitleModal1: string = '';
  @Input() subtitleModal2: string = '';

  // @Output() selected = new EventEmitter<any>(); 
  // @Output() formSave = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();
  selectedRow: any | null = null;
  @Input() buttons: {name:string, label: string, action: string, icon: string,disabled:boolean,class:string,tooltip:string }[] = [];
  @Output() buttonClick: EventEmitter<{ action: string, rowData: any }> = new EventEmitter();
  @Output() selected = new EventEmitter<any>(); 
  @Output() Unselect = new EventEmitter<any>(); 

  @ViewChild('dt') table!: Table;  // Acceso a la tabla

  primaryKey: string = '';
  globalFilterFields:string[]=[];
  uniqueId: string = ''; //para el mapa

  constructor(
    // private fb: FormBuilder,
    // private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
  ) {}
  ngOnInit(): void {
    // console.log("ver pk ",this.primaryKey);
    // this.formatoFecha();
    this.primengConfig.ripple = true;
    // this.createForm();
    // this.sesion=JSON.parse(localStorage.getItem('accesos')|| '{}').sesion;
    this.uniqueId = this.generateUniqueId();
    this.globalFilterFields = this.columns.filter(col => col.visibleTable === true).map(col => col.field); 

    this.primaryKey=  this.columns.find(col => col.primaryKey)?.field || null;

    if(this.primaryKey==null){
      console.log("No existe una llave primaria en el modelo la variable columnas no está declarada en el componente ");
      this.MensajeError("No existe una llave primaria en el modelo");
    }

  }
  scrollToSelection() {
    if (this.selectedRow) {
      const selectedIndex = this.data.findIndex(item => item === this.selectedRow);
  
      if (selectedIndex !== -1) {
        // Obtener la referencia de la fila seleccionada
        const rowElement = document.querySelector(`.p-selectable-row:nth-child(${selectedIndex + 1})`);
  
        if (rowElement) {
          // Usamos scrollIntoView para desplazar hasta la fila seleccionada
          rowElement.scrollIntoView({
            behavior: 'smooth', // Desplazamiento suave
            block: 'center',    // Alinear la fila en el centro de la vista
          });
        }
      }
    }
  }
  
  exportPDF() {
    // Crear un nuevo documento en formato carta (8.5 x 11 pulgadas)
    const doc = new jsPDF({
      orientation: 'portrait', // o 'landscape' si prefieres en horizontal
      unit: 'mm', // Utilizamos milímetros como unidad
      format: 'letter' // Tamaño carta
    });

    // Llamadas a los métodos para generar el PDF
    this.cabecera(doc, () => {
        const totalPages = this.cuerpo(doc);

        // Agregar número de página a cada página
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            this.footer(doc, i, totalPages);
        }

        // Guardar el PDF
        doc.save('reporte.pdf');
    });

  }
  cabecera(doc: jsPDF, callback: Function) {
      // Agregar el logo
      const logo = new Image();
      logo.src = 'assets/logos/logo_reporte.png'; // Ruta a tu logo
      logo.onload = () => {
          const logoX = 14;
          const logoY = 10;
          doc.addImage(logo, 'PNG', logoX, logoY, 40, 15); // x, y, width, height

          doc.setFontSize(6);
          const direccion_text = 'Cochabamba, Av. Blanco Galindo Km 8.5';
          const margen_izquiedo = 14; // Define el margen izquierdo donde quieres colocar el texto
          doc.text(direccion_text, margen_izquiedo, 28); // Alineado a la izquierda

          doc.setFontSize(6);
          const pagina_web_text = 'Página web: www.kolosu.com';
          doc.text(pagina_web_text, margen_izquiedo, 31); // Alineado a la izquierda

          doc.setFontSize(6);
          const fecha_text = 'WhatsApp: 72276601';
          doc.text(fecha_text, margen_izquiedo, 34); // Alineado a la izquierda
  
          // Agregar un título
          const pageWidth = doc.internal.pageSize.getWidth();
          doc.setFontSize(12);
          const title = this.titleModal.toUpperCase();
          const titleWidth = doc.getTextWidth(title);
          doc.text(title, (pageWidth - titleWidth) / 2, 36); // Centramos el título en el eje X
  
          // Agregar un subtítulo1
          doc.setFontSize(7);
          // const subtitle = 'GENERADO DESDE EL 21/09/2024 08:30 HASTA EL 31/12/2024 16:30';
          const subtitle = this.subtitleModal1.toUpperCase();
          const subtitleWidth = doc.getTextWidth(subtitle);
          doc.text(subtitle, (pageWidth - subtitleWidth) / 2, 40); // Centramos el subtítulo en el eje X

          // Agregar un subtítulo2
          doc.setFontSize(7);
          const placa_text = this.subtitleModal2.toUpperCase();
          const placaWidth = doc.getTextWidth(placa_text);
          doc.text(placa_text, (pageWidth - placaWidth) / 2, 44); // Centramos el subtítulo en el eje X


          /*
          // Agregar información adicional (fecha de impresión, usuario y placa)
          const date = new Date();
          // const formattedDate = '';
          const user = this.getCurrentUser();
          const plate = '5168-LCI'; // Asegúrate de tener un método para obtener la placa
          const margin = 14; // Margen derecho
          const maxTextWidth = pageWidth - margin; // Limitar ancho total de título + valor
          const info = [
              { title: '', value: 'Cochabamba, Av. Blanco Galindo Km 8.5' },
              { title: 'Página web:', value: 'www.kolosu.com' },
              { title: 'WhatsApp:', value: '72276601' },
             
              
          ];

          const initialTextY = logoY + 8;
          const lineHeight = 3;
          doc.setFontSize(6);

          info.forEach((item, index) => {
              const titleWidth = doc.getTextDimensions(item.title).w;
              const valueWidth = doc.getTextDimensions(item.value).w;
              const totalTextWidth = titleWidth + valueWidth + 2; // Suma el ancho del título y el valor

              // Si el total del título y el valor es más grande que el ancho disponible, ajusta el valor
              const titleX = (totalTextWidth > maxTextWidth)
                  ? pageWidth - margin - totalTextWidth // Alinea al margen derecho si el texto es largo
                  : pageWidth - margin - totalTextWidth; // Alinea al margen derecho si cabe bien

              const titleY = initialTextY + (index * lineHeight);

              // Dibuja el título en negrita
              // doc.setFont('Helvetica', 'bold');
              doc.setFont('Helvetica', 'normal');
              doc.text(item.title, titleX, titleY);

              // Dibuja el valor normal
              doc.setFont('Helvetica', 'normal');
              const valueX = titleX + titleWidth + 2; // Espaciado entre título y valor
              doc.text(item.value, valueX, titleY);
          });
          */


  
          // Llama a la función de callback después de que se haya agregado todo
          callback();
      };
  }
  cuerpo(doc: jsPDF) {
    // Obtener encabezados visibles y agregar un encabezado de numeración
    const headers = ['#'].concat(
        this.columns
            .filter(col => col.visibleTable)
            .map(col => col.header)
    );

    // Obtener los datos para el cuerpo de la tabla y agregar la numeración
    const body = this.data.map((item, index) => {
        const rowData = this.columns
            .filter(col => col.visibleTable)
            .map(col => item[col.field]);

        return [index + 1].concat(rowData); // Agregamos la numeración
    });

    // Contador de páginas
    let totalPages = 0;

    // Primero, contamos cuántas páginas se generan
    autoTable(doc, {
        head: [headers],
        body: body,
        startY: 50, // Ajustar posición inicial si es necesario
        margin: { bottom: 20 },// Agregar más margen inferior (aumenta el valor si es necesario)
        styles: {
            fontSize: 8, // Tamaño de fuente para el contenido de la tabla
        },
        headStyles: {
            fontSize: 9, // Tamaño de fuente para los encabezados
        },
        didDrawPage: () => {
            totalPages++; // Contamos el total de páginas
        },
        // Esta opción asegura que toda la fila pase a la siguiente página si no cabe completamente
        rowPageBreak: 'avoid',  // Evitar que la fila se rompa entre páginas


        // Aplicamos estilos especiales a la fila de resumen
        didParseCell: (data) => {
          // Verificar si es una fila de resumen
          const rowIndex = data.row.index;
          const rowData = this.data[rowIndex];

          if (rowData?.isSummary) {
            data.cell.styles.fontStyle = 'bold';  // Negrita
            data.cell.styles.fillColor = [240, 240, 240]; // Color de fondo gris claro
            data.cell.styles.textColor = [0, 0, 0]; // Color del texto (negro)
          }
        },

    });

    return totalPages; // Retornamos el total de páginas
  }

  footer(doc: jsPDF, currentPage: number, totalPages: number) {
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageString = `Página ${currentPage} de ${totalPages}`;
      doc.setFontSize(7);
      doc.text(pageString, doc.internal.pageSize.getWidth() / 2 - 10, pageHeight - 10); // Ajustar posición

      doc.setFontSize(6);
      const date = new Date();
      const formattedDate = date.toLocaleString();
      const fecha_text = 'Fecha impresión : '+formattedDate;
      const marginLeft = 14; // Define el margen izquierdo donde quieres colocar el texto
      // Alinear el texto a la izquierda usando el margen izquierdo
      doc.text(fecha_text, marginLeft, pageHeight - 9); // Alineado a la izquierda

      doc.setFontSize(6);
      const usuario = 'juan.jimenez';
      const usuario_text = 'Usuario : '+usuario;
      doc.text(usuario_text, marginLeft, pageHeight - 12); // Alineado a la izquierda
  }

    
    
    
  // Método para obtener el usuario actual (ajusta según tu lógica)
  getCurrentUser() {

      return JSON.parse(localStorage.getItem('accesos') || '{}').usuario.usuario || '';
  }
  
  onRowSelect(event:any){
    this.selected.emit(event.data);
  }
  onRowUnselect(event:any){
    this.Unselect.emit(event.data);
  }
  onButtonClick(action: string) {

    if (this.selectedRow) {
      this.buttonClick.emit({ action, rowData: this.selectedRow });
    }

  }
  save(): void {
    // this.formSave.emit(this.form.value);
  }
  cancel(event: Event): void {
    event.preventDefault();  // Evita el envío del formulario y el refresco de la página
    this.closeModal.emit();   // Emitir evento al cancelar
  }
  generateUniqueId(): string {
    // Puedes usar un número aleatorio o la fecha actual para evitar colisiones
    return Math.random().toString(36).substr(2, 9);
  }
  MensajeError(mensaje:string){
    this.messageService.add({severity:'error', summary: 'Alerta', detail: mensaje});
  }

}
