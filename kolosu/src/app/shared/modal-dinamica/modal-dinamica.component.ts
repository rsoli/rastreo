import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-modal-dinamica',
  templateUrl: './modal-dinamica.component.html',
  styleUrls: ['./modal-dinamica.component.scss']
})
export class ModalDinamicaComponent implements OnInit {
  form: FormGroup = this.fb.group({});
  @Input() columns: any[] = [];  // Columnas de la tabla
  @Input() modalVisible: boolean = false;
  @Input() titleModal: string = '';
  @Output() formSave = new EventEmitter<any>(); 
  @Output() closeModal = new EventEmitter<void>();
  @Input() formData: any = {}; 

  uniqueId: string = ''; //para el mapa
  es: any; //idioma del calendario
  
  constructor(
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
  ) {
  }

  ngOnInit(): void {
    // console.log('ngOnInit - formData:', this.formData);
    this.uniqueId = this.generateUniqueId();
    this.formatoFecha();
    this.createForm();
  }

  generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  formatoFecha() {
    this.primengConfig.setTranslation({
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Borrar',
      dateFormat: 'dd/mm/yy',
      firstDayOfWeek: 1
    });
  }

  createForm(): void {
    const group: any = {};
  
// Asegúrate de que estás manejando correctamente cada tipo de campo
this.columns.forEach(col => {
  const validators = [];

  if (col.required) {
      validators.push(Validators.required);
  }

  let value = this.formData[col.field];

  // Asignación de valor por defecto según el tipo
  if (value === undefined) {
      switch (col.inputType) {
          case 'multiselect':
              value = []; 
              break;
          case 'select':
              value = null; 
              break;
          case 'number': // Si hay un campo de tipo número
              value = 0; // O cualquier valor predeterminado que desees
              break;
          default:
              value = ''; 
      }
  }
  

  if (col.disabled) {
      group[col.field] = [{ value: value, disabled: true }, validators];
  } else {
      group[col.field] = [value, validators];
  }
});

  
    // Crea el formulario con los controles configurados
    this.form = this.fb.group(group);
  }


  
  save(): void {
    if (this.form.valid) {
      this.formSave.emit(this.form.value);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData'] && !changes['formData'].firstChange) {
        // console.log('ngOnChanges - formData:', this.formData); 
        this.createForm(); // Crea el formulario con los nuevos datos
    }
  }

  
  cancel(event: Event): void {
    event.preventDefault();  // Evita el envío del formulario y el refresco de la página
    this.closeModal.emit();   // Emitir evento al cancelar
  }
  
  getDropdownOptions(field: string): any[] {
    const column = this.columns.find(col => col.field === field);
    return column ? column.options : [];
  }

  onGeocercaChange(geocerca: any, field: string) {
    this.form.get(field)?.setValue(geocerca);
    this.form.get(field)?.markAsTouched();
    this.form.get(field)?.updateValueAndValidity();
  }

  OnDeleteGeocerca(field: string) {
    this.form.get(field)?.setValue('');
  }
}
