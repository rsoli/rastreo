import { ApiService } from './../servicios/api.service';

export class ServicioModelo {

    id_servicio: number = 0;
    codigo: string = "";
    costo_total: number = 0;
    id_cliente: number = 0;
    id_tipo_servicio: number = 0;
    tipo_servicio: string = "";

    // Definir configuración de columnas con tipos

    

    static columns = [
        { field: 'id_servicio', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'codigo', header: 'Codigo', visibleTable: false, visibleForm: false, inputType: 'text', required: false },
        { field: 'id_tipo_servicio', header: 'Tipo servicio', visibleTable: false, visibleForm: true, inputType: 'select', required: true, options: [], multiple: false },
        { field: 'tipo_servicio', header: 'Tipo de servicio', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
        { field: 'costo_total', header: 'Precio', visibleTable: true, visibleForm: true, inputType: 'number', required: true }, 
        { field: 'id_cliente', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false },
        
        
    ];

    // La inicialización puede recibir el servicio apiService directamente
    static initialize(apiService: ApiService<any>): void {
       this.ComboServicio(apiService);
    }

    static ComboServicio(apiService: ApiService<any>): void {
        apiService.getAll('servicio/lista_tipo_servicio').subscribe({
            next: (data: any) => {
                //  console.log("Respuesta del servicio:", data);
                
                const tipo_servicio = data.lista_tipo_servicio || [];
                const options = tipo_servicio.map((tipo_servicio: any) => ({
                    label: tipo_servicio.tipo_servicio ,  // Asume que estas propiedades existen
                    value: tipo_servicio.id_tipo_servicio
                }));
    
                const servicioColumn = ServicioModelo.columns.find(col => col.field === 'id_tipo_servicio');
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