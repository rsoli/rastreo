import { Component, OnInit } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/api';
import {MessageService} from 'primeng/api';
import{UsuarioService} from '../../paginas/seguridad/usuario/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [MessageService]
})
export class SidebarComponent implements OnInit {
  visibleSidebar1: any;

  files!: TreeNode[];
  selectedFile!: TreeNode;
  constructor(
    private messageService: MessageService,
    private usuario_servicio:UsuarioService
    ) { }

  ngOnInit(): void {

    this.CargarMenu();
    
  }
  CargarMenu(){

    this.usuario_servicio.get_sidebar().subscribe(data=>{ 
      let aux=JSON.parse(localStorage.getItem('accesos')|| '{}').accesos.original;

      // let menu_aux=JSON.parse(localStorage.getItem('accesos')|| '{}').accesos.original.replaceAll();
      // data["menu"].original =data["menu"].original.replaceAll('ruta_menu_sidebar', 'routerLink');

      console.log("enus ",JSON.parse(aux|| '{}').items);
      this.files=JSON.parse(aux|| '{}').items;
      // this.closeLoading();
      // localStorage.removeItem("accesos");
      // this.router.navigate(['/shared/slider']);   
    },
    error=>{
      // console.log("ver error ",error);
      // this.visible_cerrar_sesion=false;
      // this.closeLoading();
      // localStorage.removeItem("accesos");
      // this.router.navigate(['/shared/slider']);   
    })
    

    // this.files=[{
    //           "data":
    //             [
    //                 {
    //                     "label": "Documents",
    //                     "data": "Documents Folder",
    //                     "expandedIcon": "pi pi-folder-open",
    //                     "collapsedIcon": "pi pi-folder",
    //                     "children": [{
    //                             "label": "Work",
    //                             "data": "Work Folder",
    //                             "expandedIcon": "pi pi-folder-open",
    //                             "collapsedIcon": "pi pi-folder",
    //                             "children": [{"label": "Expenses.doc", "icon": "pi pi-file", "data": "Expenses Document"}, {"label": "Resume.doc", "icon": "pi pi-file", "data": "Resume Document"}]
    //                         },
    //                         {
    //                             "label": "Home",
    //                             "data": "Home Folder",
    //                             "expandedIcon": "pi pi-folder-open",
    //                             "collapsedIcon": "pi pi-folder",
    //                             "children": [{"label": "Invoices.txt", "icon": "pi pi-file", "data": "Invoices for this month"}]
    //                         }]
    //                 },
    //                 {
    //                     "label": "Pictures",
    //                     "data": "Pictures Folder",
    //                     "expandedIcon": "pi pi-folder-open",
    //                     "collapsedIcon": "pi pi-folder",
    //                     "children": [
    //                         {"label": "barcelona.jpg", "icon": "pi pi-image", "data": "Barcelona Photo"},
    //                         {"label": "logo.jpg", "icon": "pi pi-file", "data": "PrimeFaces Logo"},
    //                         {"label": "primeui.png", "icon": "pi pi-image", "data": "PrimeUI Logo"}]
    //                 },
    //                 {
    //                     "label": "Movies",
    //                     "data": "Movies Folder",
    //                     "expandedIcon": "pi pi-folder-open",
    //                     "collapsedIcon": "pi pi-folder",
    //                     "children": [{
    //                             "label": "Al Pacino",
    //                             "data": "Pacino Movies",
    //                             "children": [{"label": "Scarface", "icon": "pi pi-video", "data": "Scarface Movie"}, {"label": "Serpico", "icon": "pi pi-file-video", "data": "Serpico Movie"}]
    //                         },
    //                         {
    //                             "label": "Robert De Niro",
    //                             "data": "De Niro Movies",
    //                             "children": [{"label": "Goodfellas", "icon": "pi pi-video", "data": "Goodfellas Movie"}, {"label": "Untouchables", "icon": "pi pi-video", "data": "Untouchables Movie"}]
    //                         }]
    //                 }
    //             ]
    //           }][0].data;

    //           console.log("ver res ",this.files);
  }
  nodeSelect(event: { node: { label: any; }; }) {
    this.messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.label});
  }

  nodeUnselect(event: { node: { label: any; }; }) {
      this.messageService.add({severity: 'info', summary: 'Node Unselected', detail: event.node.label});
  }
  AbrirSideBar(){
    this.visibleSidebar1=!this.visibleSidebar1;
  }

}
