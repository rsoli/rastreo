
import { ApiService } from './../servicios/api.service';

export class RolModelo {

  id_rol:number=0;
  nombre_rol:String="";
  fecha_reg:String="";
  fecha_mod:String="";
  id_permisos:any;
//    estado:String="";

  static columns = [
    { field: 'id_rol', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
    { field: 'nombre_rol', header: 'Rol', visibleTable: true, visibleForm: true, inputType: 'text', required: true },
    { field: 'fecha_reg', header: 'Fecha reg', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
    { field: 'fecha_mod', header: 'Fecha mod', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
    // { field: 'estado', header: 'Estado', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
    { field: 'id_permisos', header: 'Accesos', visibleTable: false, visibleForm: true, inputType: 'treeSelect', required: false, options: []}
  ];

  static initialize(apiService: ApiService<any>): void {
      this.ComboPermisos(apiService);
  }
  static ComboPermisos(apiService: ApiService<any>): void {
    apiService.getAll('rol/lista_permisos').subscribe({
      next: (data: any) => {
        // Asegúrate de que data tenga la estructura correcta
        const listaPermisos = JSON.parse(JSON.stringify(data)).roles || [];
        const options = listaPermisos.map((permiso: any) => ({
          label: permiso.label,
          value: permiso.value,
          children: permiso.children || [] // Asegúrate de inicializar children como un array
        }));
  
        const permisosColumn = RolModelo.columns.find(col => col.field === 'id_permisos');
        if (permisosColumn) {
          permisosColumn.options = options; // Llena las opciones de selección
        //   console.log("lista options ", options);
        }
      },
      error: (err) => {
        console.error('Error cargando opciones de permisos', err);
      }
    });
  }
  



}
