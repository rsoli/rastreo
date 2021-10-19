import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private usuario_servicio:UsuarioService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    
  }
  nodeSelect(event: { node: { label: any,routerLink:any; }; }) {

  
    if(event.node.routerLink){
      this.router.navigate([event.node.routerLink]);  
    } 
    // this.messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.label});
  }

  nodeUnselect(event: { node: { label: any; }; }) {
      // this.messageService.add({severity: 'info', summary: 'Node Unselected', detail: event.node.label});  
  }
  AbrirSideBar(){
    if(localStorage.getItem('accesos') == undefined ){
      this.messageService.add({severity: 'info', summary: 'Mensaje', detail: 'Iniciar sesión' });
      this.visibleSidebar1=false;
    }else{
      let menu_aux=JSON.parse(localStorage.getItem('accesos')|| '{}').accesos.original.replaceAll('expandedicon','expandedIcon');
      menu_aux=menu_aux.replaceAll('collapsedicon','collapsedIcon');
      menu_aux=menu_aux.replaceAll('items','children');
      menu_aux=menu_aux.replaceAll('ruta_menu_sidebar','routerLink');
      this.files=JSON.parse(menu_aux).children;
      this.visibleSidebar1=true;
      this.expandAll();
    } 
    
  }

  expandAll(){
    this.files.forEach( node => {
        this.expandRecursive(node, true);
    } );
  }

  collapseAll(){
      this.files.forEach( node => {
          this.expandRecursive(node, false);
      } );
  }

  private expandRecursive(node:TreeNode, isExpand:boolean){
      node.expanded = isExpand;
      if (node.children){
          node.children.forEach( childNode => {
              this.expandRecursive(childNode, isExpand);
          } );
      }
  }

}
