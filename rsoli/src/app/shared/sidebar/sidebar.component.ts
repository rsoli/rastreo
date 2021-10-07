import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  visibleSidebar1: any;
  items2!: MenuItem[];
  constructor() { }

  ngOnInit(): void {

    this.items2 = [
      {
      label: 'File',
      icon:'pi pi-fw pi-file',
      items: [
          {
              label: 'New',
              icon:'pi pi-fw pi-plus',
              items: [
                  {
                  label: 'Bookmark',
                  icon:'pi pi-fw pi-bookmark'
                  },
                  {
                  label: 'Video',
                  icon:'pi pi-fw pi-video'
                  }
              ]
          }
      ]
      }
    ];
  }
  AbrirSideBar(){
    this.visibleSidebar1=!this.visibleSidebar1;
  }

}
