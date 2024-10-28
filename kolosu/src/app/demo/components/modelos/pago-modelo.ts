import { ApiService } from './../servicios/api.service';

export class PagoModelo {

    id_pago_servicio: number = 0;
    tipo_servicio: string = "";
    id_servicio: number = 0; 
    fecha_inicio: string = "";
    fecha_fin: string = "";
    fecha_pago: string = "";
    precio_mensual: number = 0;
    cantidad_vehiculos: number = 0;
    cantidad_meses: number = 0;
    sub_total: number = 0;

    apellido_materno: string = "";
    apellido_paterno: string = "";
    celular: string = "";
    ci: string = "";
    id_cliente: number = 0;
    mes_pagado: string = "";
    nombre: string = "";
    

    // Definir configuración de columnas con tipos

    static columns = [
        { field: 'id_pago_servicio', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'tipo_servicio', header: 'Tipo servicio', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
        { field: 'id_servicio', header: 'Servicios', visibleTable: false, visibleForm: true, inputType: 'select', required: true, options: [], multiple: false },
        { field: 'fecha_pago', header: 'Fecha pago', visibleTable: true, visibleForm: true, inputType: 'date', required: true },
        { field: 'fecha_inicio', header: 'Fecha inicio', visibleTable: true, visibleForm: true, inputType: 'date', required: true },
        { field: 'fecha_fin', header: 'Fecha fin', visibleTable: true, visibleForm: true, inputType: 'date', required: true },
        { field: 'mes_pagado', header: 'Mes pagado', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
        { field: 'precio_mensual', header: 'Precio mensual', visibleTable: true, visibleForm: true, inputType: 'number', required: true },
        { field: 'cantidad_vehiculos', header: 'Cantidad dispositivos', visibleTable: true, visibleForm: true, inputType: 'number', required: true },
        { field: 'cantidad_meses', header: 'Cantidad meses', visibleTable: true, visibleForm: true, inputType: 'number', required: true },
        { field: 'sub_total', header: 'Subtotal', visibleTable: true, visibleForm: true, inputType: 'number', required: true },
        
        { field: 'apellido_materno', header: 'Apellido materno', visibleTable: false, visibleForm: false, inputType: 'text', required: false },
        { field: 'apellido_paterno', header: 'Apellido paterno', visibleTable: false, visibleForm: false, inputType: 'text', required: false },
        { field: 'celular', header: 'Celular', visibleTable: false, visibleForm: false, inputType: 'text', required: false },
        { field: 'ci', header: 'CI', visibleTable: false, visibleForm: false, inputType: 'text', required: false },
        { field: 'id_cliente', header: 'ID Cliente', visibleTable: false, visibleForm: false, inputType: 'number', required: false },
        { field: 'nombre', header: 'Nombre', visibleTable: false, visibleForm: false, inputType: 'text', required: false }
        
        
    ];

    // La inicialización puede recibir el servicio apiService directamente
    static initialize(apiService: ApiService<any>,id_cliente:Number): void {
       this.ComboServicio(apiService,id_cliente);
    }

    static ComboServicio(apiService: ApiService<any>,id_cliente:Number): void {
        apiService.getAll('servicio/lista_pago_servicio_cliente/'+id_cliente).subscribe({
            next: (data: any) => {
                //  console.log("Respuesta del servicio:", data);
                
                const servicio_cliente = data.lista_pago_seleccionado || [];
                const options = servicio_cliente.map((servicio_cliente: any) => ({
                    label: servicio_cliente.tipo_servicio ,  // Asume que estas propiedades existen
                    value: servicio_cliente.id_servicio
                }));
    
                const servicioColumn = PagoModelo.columns.find(col => col.field === 'id_servicio');
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