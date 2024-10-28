
import { ApiService } from './../servicios/api.service';

export class GeocercaModelo {
  id: number = 0;
  area: string = "";
  descripcion: string = "";
  nombre_geocerca: string = "";
  tipo_geocerca: string = "";
  usuario: number = 0;

  // Otros atributos del modelo

  static columns = [
    { field: 'id', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
    { field: 'tipo_geocerca', header: 'Tipo de Geocerca', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
    { field: 'nombre_geocerca', header: 'Nombre de Geocerca', visibleTable: true, visibleForm: true, inputType: 'text', required: true },
    { field: 'descripcion', header: 'Descripción', visibleTable: true, visibleForm: true, inputType: 'textarea', required: false },
    { field: 'area', header: 'Área', visibleTable: false, visibleForm: true, inputType: 'map', required: true },
    { field: 'usuario', header: 'Usuario', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
    // Puedes añadir más atributos si es necesario.
];

  static initialize(apiService: ApiService<any>): void {
      //this.ComboPersona(apiService);
  }

  /*static ComboPersona(apiService: ApiService<any>): void {
    apiService.getAll('persona/lista_persona').subscribe({
        next: (data: any) => {
            const personas = data.personas || [];
            const options = personas.map((persona: any) => ({
                label: persona.nombre + ' ' + persona.apellido_paterno + ' ' + persona.apellido_materno,
                value: persona.id_persona
            }));

            const personaColumn = GeocercaModelo.columns.find(col => col.field === 'id_persona');
            if (personaColumn) {
                personaColumn.options = options; // Llena las opciones de selecci�n
            }
        },
        error: (err) => {
            console.error('Error cargando opciones de persona', err);
        }
    });
  }*/

}
