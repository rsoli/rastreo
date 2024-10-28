import os
import argparse

def create_file(path, content):
    with open(path, 'w') as f:
        f.write(content)

def create_component(component_name, base_path="src/app/demo/components/rastreo", model_path="src/app/demo/components/modelos"):
    # Capitalize component name for class naming conventions
    class_name = component_name.capitalize() + "Component"
    model_name = component_name.capitalize() + "Modelo"
    nombre_funcion = component_name.capitalize()
    # Component directories
    component_dir = os.path.join(base_path, component_name)  # Component directory
    model_file_path = os.path.join(model_path, component_name + "-modelo.ts")  # Model file in the correct directory (no subfolder)
    
    # Create directories if they don't exist
    os.makedirs(component_dir, exist_ok=True)
    os.makedirs(model_path, exist_ok=True)

    # Create component TypeScript file
    component_ts_content = f"""
import {{ Component, OnInit }} from '@angular/core';
import {{ MessageService }} from 'primeng/api';
import {{ ApiService }} from '../../servicios/api.service';
import {{ {model_name} }} from '../../modelos/{component_name}-modelo';
import {{ Router }} from '@angular/router';

@Component({{
  selector: 'app-{component_name}',
  templateUrl: './{component_name}.component.html',
  styleUrls: ['./{component_name}.component.css'],
  providers: [MessageService]
}})
export class {class_name} implements OnInit {{

  loading = false;
  lista_{component_name} : Array<{model_name}> = [];
  columnas_{component_name} = {model_name}.columns;
  toolbarButtons = new Array();

  constructor(private apiService: ApiService<{model_name}>, private messageService: MessageService, private router: Router) {{ }}

  ngOnInit(): void {{
    this.Listar{nombre_funcion}();
    {model_name}.initialize(this.apiService);
    this.AgregarBotones();
  }}

  Listar{nombre_funcion}() {{
    this.loading = true;

    this.apiService.getAll('{component_name}/lista_{component_name}').subscribe({{
      next: (data: {model_name}[]) => {{
        this.lista_{component_name} = JSON.parse(JSON.stringify(data)).lista_{component_name};
      }},
      error: (error) => {{
        this.MensajeError("Error al obtener la lista");
      }},
      complete: () => {{
        this.loading = false;
      }}
    }});
  }}

  guardar{nombre_funcion}({component_name}: {model_name}) {{
    this.loading = true;

    this.apiService.create('{component_name}/post_{component_name}', {component_name}).subscribe({{
      next: (data: any) => {{
        const mensaje = data?.mensaje?.[0];
        if (mensaje) {{
          this.MensajeError(mensaje);
        }} else {{
          this.Listar{nombre_funcion}();
        }}
      }},
      error: (error) => {{
        this.MensajeError("Verifique su conexión a internet");
      }},
      complete: () => {{
        this.loading = false;
      }}
    }});
  }}

  eliminar{nombre_funcion}({component_name}: {model_name}) {{
    if ({component_name}.id_{component_name}) {{
      this.loading = true;

      this.apiService.delete('{component_name}/eliminar_{component_name}', {component_name}.id_{component_name}).subscribe({{
        next: () => {{
          this.Listar{nombre_funcion}();
        }},
        error: (error) => {{
          this.MensajeError("Error al eliminar");
        }},
        complete: () => {{
          this.loading = false;
        }}
      }});
    }}
  }}

  seleccionar{nombre_funcion}({component_name}: {model_name}) {{
    this.messageService.clear();
    this.MensajeInfo("Seleccionado favor cambiar mensaje",true);
  }}

  deshacerSeleccion{nombre_funcion}({component_name}: {model_name}) {{ }}

  AgregarBotones() {{
    this.toolbarButtons.push({{
      name: "btnPrueba1",
      label: 'Aqui va el nombre del boton',
      action: 'nombre del metodo que llamara cuando haga click en el boton',
      icon: 'nombre del icono',
      disabled: true,
      class: 'p-button-rounded p-button-info'
    }});
  }}

  ButtonClick(event: {{ action: string, rowData: any }}) {{
    const {{ action, rowData }} = event;

    if (action === 'onPruba1') {{
        // Lógica para 'onPruba1'
    }} 
    else if (action === 'onPruba2') {{
        // Lógica para 'onPruba2'
    }} 
    else {{
        console.error('Acción no soportada');
    }}

  }}

  MensajeError(mensaje: string) {{
    this.messageService.add({{ severity: 'error', summary: 'Error', detail: mensaje }});
  }}

  MensajeSucces(mensaje: string) {{
    this.messageService.add({{ severity: 'success', summary: 'Éxito', detail: mensaje }});
  }}

  MensajeInfo(mensaje:string,seleccion:boolean){{
  
    if(seleccion==true){{
      this.messageService.add({{severity:'info', summary: 'Seleccionado', detail: mensaje}});
    }}else{{
      this.messageService.add({{severity:'info', summary: 'Información', detail: mensaje}});
    }}

  }}

  ButtonEnabled(name: string, disabled: boolean): void {{
    this.toolbarButtons.forEach(btn => {{
      if (btn.name === name) {{
        btn.disabled = disabled;
      }}
    }});
  }}
}}
"""
    create_file(f"{component_dir}/{component_name}.component.ts", component_ts_content)

    # Create component HTML file
    component_html_content = f"""
    <div class="card">
        <p-toast></p-toast>
        <app-loading [loading]='loading'></app-loading>
        <app-tabla-dinamica
          titleTable="Lista de {nombre_funcion}"  
          (selected)="seleccionar{nombre_funcion}($event)"  
          [buttons]='toolbarButtons'
          (buttonClick)="ButtonClick($event)"
          (Unselect)="deshacerSeleccion{nombre_funcion}($event)"
          [columns]="columnas_{component_name}"
          [data]="lista_{component_name}"
          (formSave)="guardar{nombre_funcion}($event)"
          (delete)="eliminar{nombre_funcion}($event)"
        >
        </app-tabla-dinamica>
    </div>
    """

    # Ver el contenido generado
    #print(component_html_content)

    # Guarda el archivo
    create_file(f"{component_dir}/{component_name}.component.html", component_html_content)




    # Create component CSS file
    component_css_content = "/* Styles for {} */".format(component_name)
    create_file(f"{component_dir}/{component_name}.component.css", component_css_content)

    # Create model TypeScript file
    model_ts_content = f"""
import {{ ApiService }} from './../servicios/api.service';

export class {model_name} {{
  id_{component_name}: number = 0;
  // Otros atributos del modelo

  static columns = [
    {{ field: 'id_{component_name}', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true }},
    {{ field: 'id_persona', header: 'Persona', visibleTable: false, visibleForm: true, inputType: 'select', required: false, options: [], multiple: false }},
  ];

  static initialize(apiService: ApiService<any>): void {{
      //this.ComboPersona(apiService);
  }}

  static ComboPersona(apiService: ApiService<any>): void {{
    apiService.getAll('persona/lista_persona').subscribe({{
        next: (data: any) => {{
            const personas = data.personas || [];
            const options = personas.map((persona: any) => ({{
                label: persona.nombre + ' ' + persona.apellido_paterno + ' ' + persona.apellido_materno,
                value: persona.id_persona
            }}));

            const personaColumn = {model_name}.columns.find(col => col.field === 'id_persona');
            if (personaColumn) {{
                personaColumn.options = options; // Llena las opciones de selección
            }}
        }},
        error: (err) => {{
            console.error('Error cargando opciones de persona', err);
        }}
    }});
  }}

}}
"""
    create_file(model_file_path, model_ts_content)

    # Create routing module file
    routing_module_content = f"""
import {{ NgModule }} from '@angular/core';
import {{ RouterModule, Routes }} from '@angular/router';
import {{ {class_name} }} from './{component_name}.component';

const routes: Routes = [
  {{ path: '', component: {class_name} }}
];

@NgModule({{
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
}})
export class {class_name}RoutingModule {{ }}
"""
    create_file(f"{component_dir}/{component_name}-routing.module.ts", routing_module_content)

    # Create module file
    module_content = f"""
import {{ NgModule }} from '@angular/core';
import {{ CommonModule }} from '@angular/common';
import {{ {class_name} }} from './{component_name}.component';
import {{ {class_name}RoutingModule }} from './{component_name}-routing.module';
import {{ SharedModule }} from 'src/app/shared/shared/shared.module';

@NgModule({{
  declarations: [{class_name}],
  imports: [
    CommonModule,
    {class_name}RoutingModule,
    SharedModule
  ]
}})
export class {class_name}Module {{ }}
"""
    create_file(f"{component_dir}/{component_name}.module.ts", module_content)

    print(f"Component {component_name} and model {model_name} created successfully!")

# Main function to handle command-line arguments
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Create Angular component structure with Python.')
    parser.add_argument('component_name', type=str, help='The name of the component to create')
    
    args = parser.parse_args()

    create_component(args.component_name)
