import { ApiService } from './../servicios/api.service';

export class UsuarioModelo {
    id_usuario:number=0;
    usuario:string="";
    correo:string="";
    fecha_reg:string="";
    fecha_mod:string="";
    foto:string="";
    id_persona: any = { value: 0, label: "" };
    persona:string="";
    id_roles: any[] = [];
    roles:string="";
    contrasena:string="";
    
    //id_persona: any = { value: 26, label: "Beatriz Alcon Huacani" };
    

   

    email:string="";
    password:string="";



    static columns = [
        
        { field: 'id_usuario', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'usuario', header: 'Usuario', visibleTable: true, visibleForm: true, inputType: 'text', required: true },
        { field: 'contrasena', header: 'Contraseña', visibleTable: false, visibleForm: true, inputType: 'password', required: false },
        { field: 'persona', header: 'Persona', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
        { field: 'id_persona', header: 'Persona', visibleTable: false, visibleForm: true, inputType: 'select', required: true, options: [], multiple: false },
        { field: 'correo', header: 'Correo', visibleTable: true, visibleForm: true, inputType: 'text', required: true },
        { field: 'id_roles', header: 'Roles', visibleTable: false, visibleForm: true, inputType: 'select', required: true, options: [], multiple: true },
        { field: 'roles', header: 'Roles', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
        // { field: 'created_at', header: 'Creado en', visibleTable: true, visibleForm: false, inputType: 'date', required: false },
       
    ];
    
    static initialize(apiService: ApiService<any>): void {
        this.ComboPersona(apiService);
        this.ComboRoles(apiService);
    }
    static ComboRoles(apiService: ApiService<any>): void {
        apiService.getAll('rol/lista_rol').subscribe({
            next: (data: any) => {
                // console.log("Respuesta del servicio:", data);
                
                const roles = data.roles || [];
                const options = roles.map((rol: any) => ({
                    label: rol.nombre_rol,  // Asume que estas propiedades existen
                    value: rol.id_rol
                }));
    
                const personaColumn = UsuarioModelo.columns.find(col => col.field === 'id_roles');
                if (personaColumn) {
                    personaColumn.options = options; // Llena las opciones de selección
                }
            },
            error: (err) => {
                console.error('Error cargando opciones de roles', err);
            }
        });
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
    
                const personaColumn = UsuarioModelo.columns.find(col => col.field === 'id_persona');
                if (personaColumn) {
                    personaColumn.options = options; // Llena las opciones de selección
                }
            },
            error: (err) => {
                console.error('Error cargando opciones de personas', err);
            }
        });
    }


    static columns_password =[
        { field: 'id_usuario', header: 'ID', visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'correo', header: 'Correo', visibleForm: true, inputType: 'text', required: false,disabled:true },
        { field: 'contrasena', header: 'Nueva contraseña', visibleForm: true, inputType: 'password', required: true },
        { field: 'repetir_contrasena', header: 'Repetir contraseña', visibleForm: true, inputType: 'password', required: true },
    ];

}
