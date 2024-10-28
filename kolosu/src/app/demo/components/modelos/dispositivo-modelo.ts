
import { ApiService } from './../servicios/api.service';

export class DispositivoModelo {
  id_vehiculo: number = 0;

  placa: string = "";
  marca: string = "";
  modelo: string = "";
  color: string = "";
  cilindrada: string = "";

  id_cliente: number = 0;
  activar_motor:string="";
  desactivar_motor:string="";
  motor:string="";

  id_geocercas:any=[];
  geocercas:string="";
  id_notificaciones:any=[];
  notificaciones:string="";

  //para enviar comandos gprs
  device_id:number=0;
  command:string='';

  //para cambio de icono segun estado
  id_dispositivo:number=0;

  static columns = [
    { field: 'id_vehiculo', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
    
    { field: 'placa', header: 'Placa', visibleTable: true, visibleForm: false, inputType: 'text',required:true },
    { field: 'marca', header: 'Marca', visibleTable: true, visibleForm: false, inputType: 'text',required:true },
    { field: 'modelo', header: 'Modelo', visibleTable: true, visibleForm: false, inputType: 'text',required:true },
    { field: 'color', header: 'Color', visibleTable: true, visibleForm: false, inputType: 'text',required:true },
    { field: 'cilindrada', header: 'Cilindrada', visibleTable: true, visibleForm: false, inputType: 'text',required:true },
    { field: 'geocercas', header: 'Geocercas', visibleTable: true, visibleForm: false, inputType: 'text',required:false },
    { field: 'notificaciones', header: 'Notificaciones', visibleTable: true, visibleForm: false, inputType: 'text',required:false },
    
    { field: 'id_cliente', header: 'Persona', visibleTable: false, visibleForm: false, inputType: 'select', required: false, options: [], multiple: false },
    { field: 'motor', header: 'Motor', visibleTable: true, visibleForm: false, inputType: 'text',required:false },
  ];

  static columns_geocerca = [
    { field: 'id_vehiculo', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
    { field: 'id_geocercas', header: 'geocercas',placeholder:'Seleccionar', visibleTable: true, visibleForm: true, inputType: 'select', required: true, options: [], multiple: true },
    { field: 'id_notificaciones', header: 'Notificaciones',placeholder:'Seleccionar', visibleTable: true, visibleForm: true, inputType: 'select', required: true, options: [], multiple: true },
    //{ field: 'activar_motor', header: 'Activar motor', visibleTable: false, visibleForm: false, inputType: 'text',required:false },
    //{ field: 'desactivar_motor', header: 'Desactivar motor', visibleTable: false, visibleForm: false, inputType: 'text',required:false },
   
  ];


  static initialize(apiService: ApiService<any>): void {
      this.ComboGeocerca(apiService);
      this.ComboNotificaciones(apiService);
  }

  static ComboGeocerca(apiService: ApiService<any>): void {
    apiService.getAll('servicio/lista_geocercas').subscribe({
        next: (data: any) => {
           
            const geocercas = data.lista_geocercas || [];
            const options = geocercas.map((geocerca: any) => ({
                label: geocerca.nombre_geocerca,
                value: geocerca.id
            }));

            const idGeocercaColumn = DispositivoModelo.columns_geocerca.find(col => col.field === 'id_geocercas');
            if (idGeocercaColumn) {
                idGeocercaColumn.options = options; // Llena las opciones de seleccion
            }
        },
        error: (err) => {
            console.error('Error cargando opciones de geocerca', err);
        }
    });
  }
  static ComboNotificaciones(apiService: ApiService<any>): void{
    apiService.getAll('servicio/lista_geocercas').subscribe({
      next: (data: any) => {
          
         
          const notificaciones = data.lista_notificacion || [];
          const options = notificaciones.map((noti: any) => ({
              label: noti.notificacion,
              value: noti.id_notificacion
          }));

          const idNotificacionColumn = DispositivoModelo.columns_geocerca.find(col => col.field === 'id_notificaciones');
          if (idNotificacionColumn) {
              idNotificacionColumn.options = options; // Llena las opciones de seleccion
          }
      },
      error: (err) => {
          console.error('Error cargando opciones de geocerca', err);
      }
    });

  }

}
