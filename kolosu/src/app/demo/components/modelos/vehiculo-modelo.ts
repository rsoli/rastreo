
import { ApiService } from './../servicios/api.service';

export class VehiculoModelo {
  id_vehiculo: number = 0;
  // Otros atributos del modelo
  tipo_servicio: string = "";
  id_tipo_servicio: number = 0;

  nombre_departamento:string = "";
  id_departamento: number = 0;

  placa: string = "";
  marca: string = "";
  modelo: string = "";
  color: string = "";
  cilindrada: string = "";
  uniqueid: string = "";
  linea_gps: string = "";
  modelo_gps: string = "";

  fecha_registro: string = "";
  id_cliente: number = 0;

  static columns = [

    { field: 'id_vehiculo', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
    
    { field: 'tipo_servicio', header: 'Tipo servicio', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
    { field: 'id_tipo_servicio', header: 'Tipo Servicio', visibleTable: false, visibleForm: true, inputType: 'select', required: true, options: [], multiple: false },
    
    { field: 'nombre_departamento', header: 'Departamento', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
    { field: 'id_departamento', header: 'Departamento', visibleTable: false, visibleForm: true, inputType: 'select', required: true, options: [], multiple: false },
    
    { field: 'placa', header: 'Placa', visibleTable: true, visibleForm: true, inputType: 'text', required: true },
    { field: 'marca', header: 'Marca', visibleTable: true, visibleForm: true, inputType: 'text', required: false },
    { field: 'modelo', header: 'Modelo', visibleTable: true, visibleForm: true, inputType: 'text', required: false },
    { field: 'color', header: 'Color', visibleTable: true, visibleForm: true, inputType: 'text', required: false },
    { field: 'cilindrada', header: 'Cilindrada', visibleTable: true, visibleForm: true, inputType: 'text', required: false },
    { field: 'uniqueid', header: 'Imei', visibleTable: true, visibleForm: true, inputType: 'text', required: true },
    { field: 'linea_gps', header: 'Línea GPS', visibleTable: true, visibleForm: true, inputType: 'text', required: true },
    { field: 'modelo_gps', header: 'Modelo GPS', visibleTable: true, visibleForm: true, inputType: 'text', required: true },

    { field: 'fecha_registro', header: 'Fecha Registro', visibleTable: true, visibleForm: false, inputType: 'datetime', required: false },
    { field: 'id_cliente', header: 'ID Cliente', visibleTable: false, visibleForm: false, inputType: 'select', required: false, options: [], multiple: false }
  
  ];

  static initialize(apiService: ApiService<any>,id_cliente:Number): void {
      this.ComboTipoServicio(apiService,id_cliente);
      this.ComboDepartamento(apiService);
  }

  static ComboTipoServicio(apiService: ApiService<any>,id_cliente:Number): void {
    apiService.getAll('servicio/lista_pago_servicio_cliente/'+id_cliente).subscribe({
        next: (data: any) => {
            //  console.log("Respuesta del servicio:", data);
            
            const servicio_cliente = data.lista_pago_seleccionado || [];
            const options = servicio_cliente.map((servicio_cliente: any) => ({
                label: servicio_cliente.tipo_servicio ,  // Asume que estas propiedades existen
                value: servicio_cliente.id_tipo_servicio
            }));

            const servicioColumn = VehiculoModelo.columns.find(col => col.field === 'id_tipo_servicio');
            if (servicioColumn) {
                servicioColumn.options = options; // Llena las opciones de selección
            }
        },
        error: (err) => {
            console.error('Error cargando opciones de tipo de servicio', err);
        }
    });
  }
  static ComboDepartamento(apiService: ApiService<any>): void {
    apiService.getAll('parametros/lista_departamento').subscribe({
        next: (data: any) => {
            //  console.log("Respuesta del servicio:", data);
            
            const departamento = data.departamentos || [];
            const options = departamento.map((depa: any) => ({
                label: depa.nombre_departamento ,  // Asume que estas propiedades existen
                value: depa.id_departamento
            }));

            const servicioColumn = VehiculoModelo.columns.find(col => col.field === 'id_departamento');
            if (servicioColumn) {
                servicioColumn.options = options; // Llena las opciones de selección
            }
        },
        error: (err) => {
            console.error('Error cargando opciones de tipo de servicio', err);
        }
    });
  }

}


