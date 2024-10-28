export class PersonaModelo {
    id_persona: number = 0;
    nombre: string = "";
    apellido_paterno: string = "";
    apellido_materno: string = "";
    celular: string = "";
    telefono: string = "";
    ci: string = "";

    static primaryKey: string = 'id_persona';
    // Definir configuración de columnas con tipos
    static columns = [
        { field: 'id_persona', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number',required:false,primaryKey:true  },
        { field: 'nombre', header: 'Nombre', visibleTable: true, visibleForm: true, inputType: 'text',required:true },
        { field: 'apellido_paterno', header: 'Apellido Paterno', visibleTable: true, visibleForm: true, inputType: 'text',required:true },
        { field: 'apellido_materno', header: 'Apellido Materno', visibleTable: true, visibleForm: true, inputType: 'text',required:true },
        { field: 'ci', header: 'CI',  visibleTable: true, visibleForm: true, inputType: 'text',required:true },
        { field: 'celular', header: 'Celular', visibleTable: true, visibleForm: true, inputType: 'text',required:true },
        { field: 'telefono', header: 'Teléfono', visibleTable: true, visibleForm: true, inputType: 'text',required:false },
        // Puedes añadir más atributos con diferentes tipos, como 'combo_simple', 'combo_multiple', etc.
    ];
}
