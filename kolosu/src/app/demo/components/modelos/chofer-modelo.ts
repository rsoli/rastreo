
import { ApiService } from './../servicios/api.service';

export class ChoferModelo {
    id_chofer: number = 0;
    nombre: string = "";
    apellido_paterno: string = "";
    apellido_materno: string = "";
    categoria_licencia: string = "";
    numero_licencia: string = "";

    id_personas=[];

    static primaryKey: string = 'id_chofer';

    // Definir configuración de columnas con tipos
    static columns = [
        { field: 'id_chofer', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'nombre', header: 'Nombre', visibleTable: true, visibleForm: true, inputType: 'text', required: true },
        { field: 'apellido_paterno', header: 'Apellido Paterno', visibleTable: true, visibleForm: true, inputType: 'text', required: true },
        { field: 'apellido_materno', header: 'Apellido Materno', visibleTable: true, visibleForm: true, inputType: 'text', required: true },
        { field: 'categoria_licencia', header: 'Categoría Licencia', visibleTable: true, visibleForm: true, inputType: 'text', required: true },
        { field: 'numero_licencia', header: 'Número de licencia', visibleTable: true, visibleForm: true, inputType: 'text', required: true },

        { field: 'id_personas', header: 'Personas', visibleTable: true, visibleForm: true, inputType: 'select', required: false, options: [], multiple: false },
        { field: 'descripcion', header: 'Descripción', visibleTable: true, visibleForm: true, inputType: 'textarea', required: false },
        { field: 'contraseña', header: 'Contraseña', visibleTable: true, visibleForm: true, inputType: 'password', required: false },
        { field: 'Sexo', header: 'Sexo', visibleTable: true, visibleForm: true, inputType: 'checkbox', required: false },
        { field: 'geocerca', header: 'Geocerca', visibleTable: true, visibleForm: true, inputType: 'map', required: false },
        { field: 'fecha_nacimiento', header: 'Fecha de nacimiento', visibleTable: true, visibleForm: true, inputType: 'date', required: false },
        { field: 'feriado', header: 'Feriado', visibleTable: true, visibleForm: true, inputType: 'datetime', required: false },
        { field: 'hora', header: 'Hora inicio', visibleTable: true, visibleForm: true, inputType: 'time', required: false },
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
    
                const personaColumn = ChoferModelo.columns.find(col => col.field === 'id_personas');
                if (personaColumn) {
                    personaColumn.options = options; // Llena las opciones de selección
                }
            },
            error: (err) => {
                console.error('Error cargando opciones de personas', err);
            }
        });
    }
}


/*
npm install leaflet
npm install leaflet leaflet-draw
npm install --save-dev @types/leaflet    --- ya no es necesario
npm install --save-dev @types/leaflet --legacy-peer-deps
npm install leaflet-draw   --ya no es necesario
npm install leaflet-draw --legacy-peer-deps
---eliminar node
rd /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps
Revertir a una Versión Compatible de @angular-devkit/build-  a la version 15
npm uninstall @angular-devkit/build-angular
npm install @angular-devkit/build-angular@15
npm install


npm install @types/leaflet@^1.9.12 --save-dev
npm install @types/leaflet@^1.9.12 @types/leaflet-draw@^1.0.7 --save-dev



<input type="text" placeholder="Ingrese texto" />
<input type="number" placeholder="Ingrese número" />
<textarea placeholder="Ingrese texto largo"></textarea>

<select>
  <option value="1">Opción 1</option>
  <option value="2">Opción 2</option>
</select>

<select multiple>
  <option value="1">Opción 1</option>
  <option value="2">Opción 2</option>
</select>

<input type="checkbox" />

<label><input type="checkbox" /> Opción 1</label>
<label><input type="checkbox" /> Opción 2</label>

<input type="radio" name="group1" /> Opción 1
<input type="radio" name="group1" /> Opción 2

<input type="password" placeholder="Ingrese su contraseña" />

<input type="email" placeholder="Ingrese su correo" />

<input type="date" />

<input type="datetime-local" />

<input type="time" />

<input type="color" />

<input type="file" />

<input type="range" min="0" max="100" />



*/