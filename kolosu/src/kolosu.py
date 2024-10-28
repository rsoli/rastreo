import os

def create_file(path, content):
    with open(path, 'w') as f:
        f.write(content)

def create_component(component_name, base_path="src/app/demo/components/rastreo", model_path="src/app/demo/components/modelos"):
    # Capitalize component name
    class_name = component_name.capitalize() + "Component"
    model_name = component_name.capitalize() + "Modelo"
    
    # Component directories
    component_dir = os.path.join(base_path, component_name)
    model_dir = os.path.join(model_path, component_name)
    
    # Create directories if they don't exist
    os.makedirs(component_dir, exist_ok=True)
    os.makedirs(model_dir, exist_ok=True)

    # Create component TypeScript file
    component_ts_content = f"""
import {{ Component, OnInit }} from '@angular/core';
import {{ MessageService }} from 'primeng/api';
import {{ ApiService }} from '../../servicios/api.service';
import {{ Router }} from '@angular/router';

@Component({{
  selector: 'app-{component_name}',
  templateUrl: './{component_name}.component.html',
  styleUrls: ['./{component_name}.component.css'],
  providers: [MessageService]
}})
export class {class_name} implements OnInit {{
    // Component logic here
}}
    """
    create_file(f"{component_dir}/{component_name}.component.ts", component_ts_content)

    # Create component HTML file
    component_html_content = f"""
<div class="card">
  <p-toast></p-toast> 
  <app-loading [loading]="loading"></app-loading>
  <app-tabla-dinamica></app-tabla-dinamica>
</div>
    """
    create_file(f"{component_dir}/{component_name}.component.html", component_html_content)

    # Create component CSS file
    component_css_content = "/* Styles for {} */".format(component_name)
    create_file(f"{component_dir}/{component_name}.component.css", component_css_content)

    # Create model TypeScript file
    model_ts_content = f"""
export class {model_name} {{
  id_{component_name}: number;
  // Other model attributes

  static columns = [
    {{ field: 'id_{component_name}', header: 'ID', visibleTable: false, visibleForm: false }}
  ];
}}
    """
    create_file(f"{model_dir}/{component_name}-modelo.ts", model_ts_content)

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
export class {class_name}RoutingModule {{}}
    """
    create_file(f"{component_dir}/{component_name}-routing.module.ts", routing_module_content)

    # Create module file
    module_content = f"""
import {{ NgModule }} from '@angular/core';
import {{ CommonModule }} from '@angular/common';
import {{ {class_name} }} from './{component_name}.component';
import {{ {class_name}RoutingModule }} from './{component_name}-routing.module';

@NgModule({{
  declarations: [{class_name}],
  imports: [
    CommonModule,
    {class_name}RoutingModule
  ]
}})
export class {class_name}Module {{}}
    """
    create_file(f"{component_dir}/{component_name}.module.ts", module_content)

    print(f"Component {component_name} created successfully!")

# Example usage
component_name = "miComponente"  # Change this to your component name
create_component(component_name)
