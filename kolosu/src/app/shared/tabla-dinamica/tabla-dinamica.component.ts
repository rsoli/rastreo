import { Component,EventEmitter,Input, Output,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tabla-dinamica',
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss'],
  providers: [ConfirmationService,MessageService],
})
export class TablaDinamicaComponent implements OnInit {
  @Input() columns: any[] = [];  // Columnas de la tabla
  @Input() data: any[] = [];     // Datos de la tabla
  @Input() modalVisible: boolean = false;
  @Input() titleTable: string = '';
  @Input() filterTable: boolean = true;
  @Input() paginator: boolean = true;
  @Input() toolbar: boolean = true;

  @Input() buttonNew: boolean = true;
  @Input() buttonEdit: boolean = true;
  @Input() buttonDelete: boolean = true;
  // @Input() primaryKey: string = '';
  primaryKey: string = '';
  @Input() buttons: {name:string, label: string, action: string, icon: string,disabled:boolean,class:string,tooltip:string }[] = [];

  @Output() delete = new EventEmitter<any>();
  @Output() formSave = new EventEmitter<any>(); 
  @Output() selected = new EventEmitter<any>(); 
  @Output() Unselect = new EventEmitter<any>(); 
  @Output() buttonClick: EventEmitter<{ action: string, rowData: any }> = new EventEmitter();

  globalFilterFields:string[]=[];
  sesion: boolean = false; // Agrega esta variable si es necesario
  form: FormGroup = this.fb.group({});
  selectedRow: any | null = null;
  uniqueId: string = ''; //para el mapa
  es: any;//idioma del calendario
  title_form: string = '';



  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    // console.log("ver pk ",this.primaryKey);
    this.formatoFecha();
    this.primengConfig.ripple = true;
    this.createForm();
    this.sesion=JSON.parse(localStorage.getItem('accesos')|| '{}').sesion;
    this.uniqueId = this.generateUniqueId();
    this.globalFilterFields = this.columns.filter(col => col.visibleTable === true).map(col => col.field); 

    this.primaryKey=  this.columns.find(col => col.primaryKey)?.field || null;

    if(this.primaryKey==null){
      console.log("No existe una llave primaria en el modelo la variable columnas no está declarada en el componente ");
      this.MensajeError("No existe una llave primaria en el modelo");
    }

  }

  formatoFecha(){
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
  generateUniqueId(): string {
    // Puedes usar un número aleatorio o la fecha actual para evitar colisiones
    return Math.random().toString(36).substr(2, 9);
  }
  onAdd() {

    // Lógica para agregar un nuevo registro
    this.title_form = 'NUEVO FORMULARIO';
    this.modalVisible = true;
    this.form.reset(); // Opcional: Reinicia el formulario
    // console.log('Agregar nuevo',this.columns);
   
  }
/*
  onEdit() {

    this.title_form = 'EDITAR FORMULARIO';
    if (this.selectedRow) {
      // Rellena el formulario con los datos del registro seleccionado
      this.form.patchValue(this.selectedRow);
      // console.log(this.selectedRow);
      // Muestra el modal de edición
      this.modalVisible = true;
    } else {
      // Opcional: Mostrar un mensaje de error si no hay ninguna fila seleccionada
      console.warn('No hay ningún registro seleccionado para editar.');
    }

  }*/
  
  /*  onEdit() {
      if (this.selectedRow) {
          this.title_form = 'EDITAR FORMULARIO';
       
          // Crear un objeto para almacenar los valores a parchear en el formulario
          const formValues: any = {};
  
          // Iterar sobre las columnas para preparar los datos a parchear
          this.columns.forEach(col => {
              if (col.inputType === 'select' && col.multiple) {
   
                let jsonString = this.selectedRow[col.field];
                formValues[col.field] = JSON.parse(jsonString);

              } else if (col.inputType === 'select' && !col.multiple) {

                  formValues[col.field] =  JSON.parse(this.selectedRow[col.field]);

              } else {
                  // Para los demás campos, asigna el valor directamente
                  formValues[col.field] = this.selectedRow[col.field];
              }
          });
  
          // Rellenar el formulario con los valores preparados
          this.form.patchValue(formValues);
  


          // Suscribirse a los cambios en los campos del formulario (opcional, si necesitas reactividad)
          this.columns.forEach(col => {
            if (col.inputType === 'treeSelect') {
              this.form.get(col.field)?.valueChanges.subscribe(selectedValues => {
                    console.log(`Valores seleccionados para ${col.field}: `, selectedValues);
              });
            }
          });


          // Muestra el modal de edición
          this.modalVisible = true;
      } else {
          // Mostrar un mensaje visual si no hay ninguna fila seleccionada
          console.warn('Por favor, selecciona un registro para editar.');
      }
  }
  */
onEdit() {
    if (this.selectedRow) {
        this.title_form = 'EDITAR FORMULARIO';

        // Crear un objeto para almacenar los valores a parchear en el formulario
        const formValues: any = {};

        // Iterar sobre las columnas para preparar los datos a parchear
        this.columns.forEach(col => {

          const jsonString = this.selectedRow[col.field];

            if (col.inputType === 'select') {
                if (col.multiple) {
                    
                    formValues[col.field] = jsonString ? JSON.parse(jsonString) : [];
                    console.log("ver mult ",formValues[col.field] );
                    
                } else {

                    formValues[col.field] = jsonString ? JSON.parse(jsonString) : null;

                }
            } else if (col.inputType === 'treeSelect') {

                // console.log("ver como lelga ",JSON.parse(this.selectedRow[col.field]));
                // formValues[col.field] =[
                //   { key: 21, label: 'Asignacion de permisos' } ,
                //   { key: 35, label: 'Seguridad'},
                //   { key: 41, label: 'Monitoreos'}
                // ];
                // const selectedKeys = this.selectedRow[col.field] || [];
                formValues[col.field] = jsonString ? JSON.parse(jsonString) : [];

            } else if (col.inputType === 'date') {
              const dateValue = jsonString ? new Date(jsonString) : null;
              // console.log(dateValue);
              formValues[col.field] = dateValue;
            }
            else if (col.inputType === 'number') {
            
              formValues[col.field] = jsonString ? parseFloat(jsonString) : null; 
            }
            else {
                // Para los demás campos, asigna el valor directamente
                formValues[col.field] = this.selectedRow[col.field];
            }
        });

        // Rellenar el formulario con los valores preparados
        this.form.patchValue(formValues);


        // Muestra el modal de edición
        this.modalVisible = true;
    } else {
        // Mostrar un mensaje visual si no hay ninguna fila seleccionada
        console.warn('Por favor, selecciona un registro para editar.');
    }
}

getTreeSelectOptions(field: string): any[] {
  const column = this.columns.find(col => col.field === field);
  
  if (column) {    

    return column.options || []; // Asegúrate de que siempre se retorne un array

  }

  console.warn("Campo no encontrado:", field);
  return []; // Retorna un array vacío si no hay opciones

}





  onDelete(): void {
    if (this.selectedRow) {
      this.confirmationService.confirm({
        message: `¿Estás seguro(a) de eliminar?`,
        header: 'Alerta!!',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // console.log("eliminado confirm2");
          this.delete.emit(this.selectedRow); // Emite el evento de eliminación
        },
        reject: () => {
          console.log("Eliminación cancelada");
        }
      });
    } else {
      console.log("Seleccionar una fila para eliminar");
    }
  }
  onRowSelect(event:any){
    this.selected.emit(event.data);
  }
  onRowUnselect(event:any){
    this.Unselect.emit(event.data);
  }
//   createForm(): void {
//     const group: any = {};

//     this.columns.forEach(col => {
//         const validators = []; // Array para almacenar las validaciones
//         // Verificar si el campo es requerido
//         if (col.required) {
//             validators.push(Validators.required);
//         }

//         // Aplicar validaciones específicas según el tipo de campo
//         switch (col.inputType) {
//             case 'text':
//                 break;
//             case 'number':
//                 validators.push(Validators.pattern('^[0-9]+$'));
//                 break;
//             case 'select':
//                 break;
//             case 'textarea':
//                 break;
//             case 'checkbox':
//                 break;
//             case 'password':
//                 break; // Cambié 'paspassword' a 'password' para mayor claridad
//             case 'map':
//                 if (col.required) {
//                     validators.push(Validators.required);
//                 }
//                 group[col.field] = ['', validators];
//                 break;
//             case 'date':
//             case 'dateTime':
//             case 'time':
//                 break; // Aquí podrías agregar validaciones si las necesitas
//             case 'treeSelect':
//                 // Inicializa como un objeto vacío para el treeSelect
//                 group[col.field] = [];
//                 break;
//             default:
//                 group[col.field] = ['', validators]; // Asegúrate de que se aplique a otros tipos también
//                 break;
//         }

//          group[col.field] = ['', validators]; 
//     });

//     this.form = this.fb.group(group);
// }
  
  createForm(): void {
    const group: any = {};

    this.columns.forEach(col => {
        const validators = []; // Array para almacenar las validaciones

        // Verificar si el campo es requerido
        if (col.required) {
            validators.push(Validators.required);
        }

        // Aplicar validaciones específicas según el tipo de campo
        switch (col.inputType) {
            case 'text':
                group[col.field] = ['', validators];
                break;
            case 'number':
                validators.push(Validators.pattern('^[0-9]+$'));
                group[col.field] = ['', validators];
                break;
            case 'select':
                group[col.field] = ['', validators];
                break;
            case 'textarea':
                group[col.field] = ['', validators];
                break;
            case 'checkbox':
                group[col.field] = [false]; // Asumiendo que es un booleano
                break;
            case 'password':
                group[col.field] = ['', validators];
                break;
            case 'map':
                if (col.required) {
                    validators.push(Validators.required);
                }
                group[col.field] = ['', validators]; // Asegúrate de que sea una cadena o un objeto si es necesario
                break;
            case 'date':
            case 'dateTime':
            case 'time':
                group[col.field] = ['', validators]; // Aquí puedes agregar validaciones si es necesario
                break;
            case 'treeSelect':
                group[col.field] = []; // Inicializa como un array vacío
                break;
            default:
                group[col.field] = ['', validators]; // Para otros tipos
                break;
        }
    });

    this.form = this.fb.group(group);
  }
  
  save(): void {

    
    if (this.form.valid && this.primaryKeyExists(this.form, this.primaryKey)) {

      this.setPrimaryKeyValue(this.form, this.primaryKey);
      // console.log('Form data:', this.form.value);
      this.formSave.emit(this.form.value); // Emitir el evento con los datos del formulario
      this.modalVisible = false;
      this.selectedRow = null;

    }
    else{

      if (!this.primaryKeyExists(this.form, this.primaryKey)) {

        this.MensajeError(`La llave primaria ${this.primaryKey} no existe en el formulario.`);

      }
      if (!this.form.valid) {

        this.MensajeError(`Ingrese todos los campos requeridos.`);

      }
    }
    // if (this.form.valid) {
    //   console.log('Form data:', this.form.value);
    //   // Aquí puedes agregar la lógica para guardar los datos
    // }
  }
  onButtonClick(action: string) {
    this.buttonClick.emit({ action, rowData: this.selectedRow });
  }
  setPrimaryKeyValue(form: FormGroup, primaryKey: string) {
    const control = form.get(primaryKey);
    if (control) {
      const currentValue = control.value;
      if (currentValue === null || currentValue === 0) {
        control.setValue(0); // Solo establece el valor a 0 si es null o 0
      }
    } else {
      // console.error(`El llave primary key ${primaryKey} no existe en el formulario.`);
    }
  }
  primaryKeyExists(form: FormGroup, primaryKey: string): boolean {
    // Verifica si el formulario tiene el control de la clave primaria
    return form.get(primaryKey) !== null;
  }
  getDropdownOptions(field: string): any[] {

    // console.log("dropdown ", field, this.columns);
    // Buscar la columna correspondiente en this.columns
    const column = this.columns.find(col => col.field === field);
    // Verificar si la columna tiene opciones
    if (column && column.options) {
      return column.options.map((option: any) => ({
        value: option.value, // Asegúrate de que esto se ajuste a tu estructura de datos
        label: option.label  // Asegúrate de que esto se ajuste a tu estructura de datos
      }));
    }

    // Retornar un array vacío si no se encuentra la columna o no tiene opciones
    return [];
  }

  onGeocercaChange(geocerca: any, field: string) {
    this.form.get(field)?.setValue(geocerca);
    this.form.get(field)?.markAsTouched();
    this.form.get(field)?.updateValueAndValidity();
    //console.log("formulario",this.form);
  }
  OnDeleteGeocerca(field: string){
    //console.log("eliminado");
    this.form.get(field)?.setValue('');
  }
  // onTreeSelectChange(event: any, field: string) {
  //   this.form.get(field)?.setValue(event);
  // }
  
  MensajeError(mensaje:string){
    this.messageService.add({severity:'error', summary: 'Alerta', detail: mensaje});
  }

}




