import { ApiService } from './../servicios/api.service';

export class clienteModelo {

    id_cliente: number = 0;
    id_persona: number = 0;
    persona: string = "";
    usuario_reg: string = "";
    usuario_mod: string | null = null;
    fecha_reg: Date = new Date();
    fecha_mod: Date | null = null;
    direccion: string = "";

    
    

    // Definir configuración de columnas con tipos
    static columns = [
        { field: 'id_cliente', header: 'ID Cliente', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'persona', header: 'Cliente', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
        { field: 'id_persona', header: 'Persona', visibleTable: false, visibleForm: true, inputType: 'select', required: false, options: [], multiple: false },
        { field: 'direccion', header: 'Dirección', visibleTable: true, visibleForm: true, inputType: 'textarea', required: true },
        { field: 'fecha_mod', header: 'Fecha Mod', visibleTable: true, visibleForm: false, inputType: 'date', required: false },
        { field: 'fecha_reg', header: 'Fecha Reg', visibleTable: true, visibleForm: false, inputType: 'datetime', required: false },
        { field: 'usuario_reg', header: 'Usuario Reg', visibleTable: true, visibleForm: false, inputType: 'datetime', required: false },
        { field: 'usuario_mod', header: 'Usuario Mod', visibleTable: true, visibleForm: false, inputType: 'datetime', required: false },
       
    ];

    // La inicialización puede recibir el servicio apiService directamente
    static initialize(apiService: ApiService<any>): void {
        this.ComboPersona(apiService);
    }

    static ComboPersona(apiService: ApiService<any>): void {
        apiService.getAll('persona/lista_persona').subscribe({
            next: (data: any) => {
                // console.log("Respuesta del servicio:", data);
                
                const personas = data.personas || [];
                const options = personas.map((persona: any) => ({
                    label: persona.nombre + ' ' + persona.apellido_paterno + ' ' + persona.apellido_materno,  // Asume que estas propiedades existen
                    value: persona.id_persona
                }));
    
                const personaColumn = clienteModelo.columns.find(col => col.field === 'id_persona');
                if (personaColumn) {
                    personaColumn.options = options; // Llena las opciones de selección
                }
            },
            error: (err) => {
                console.error('Error cargando opciones de cliente', err);
            }
        });
    }
    
}