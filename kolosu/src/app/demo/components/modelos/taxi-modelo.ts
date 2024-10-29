
import { ApiService } from './../servicios/api.service';

export class TaxiModelo {
  id_taxi: number = 0;
  // Otros atributos del modelo

  static columns = [
    { field: 'id_taxi', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
    { field: 'id_persona', header: 'Persona', visibleTable: false, visibleForm: true, inputType: 'select', required: false, options: [], multiple: false },
  ];

  static initialize(apiService: ApiService<any>): void {
      //this.ComboPersona(apiService);
  }

  static ComboPersona(apiService: ApiService<any>): void {
    apiService.getAll('persona/lista_persona').subscribe({
        next: (data: any) => {
            const personas = data.personas || [];
            const options = personas.map((persona: any) => ({
                label: persona.nombre + ' ' + persona.apellido_paterno + ' ' + persona.apellido_materno,
                value: persona.id_persona
            }));

            const personaColumn = TaxiModelo.columns.find(col => col.field === 'id_persona');
            if (personaColumn) {
                personaColumn.options = options; // Llena las opciones de selección
            }
        },
        error: (err) => {
            console.error('Error cargando opciones de persona', err);
        }
    });
  }

}
