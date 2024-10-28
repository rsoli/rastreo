import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
       
        this.model=[];
        //cargando menu public
        
        
        if (localStorage.getItem('accesos') !== null) {
            this.CargarMenuUsuario();
        }else{
            this.CargarMenuPublico();
        }
        
        /*

        this.model = [
            {
                label: 'Publico',
                items: [
                    { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/public/inicio'] },
                    { label: 'Sobre Nosotros', icon: 'pi pi-fw pi-users', routerLink: ['/public/sobre-nosotros'] },
                    { label: 'Contacto', icon: 'pi pi-fw pi-phone', routerLink: ['/public/contacto'] }
                    
                ]
            },
            {
                label: 'Servicios',
                items: [
                    { label: 'Rastreo Satelital', icon: 'pi pi-fw pi-map-marker', routerLink: ['/public/rastreo-satelital'] },
                    { label: 'Desarrollo de Software', icon: 'pi pi-fw pi-globe', routerLink: ['/public/desarrollo-software'] },
                    { label: 'Inteligencia de negocios', icon: 'pi pi-fw pi-chart-line', routerLink: ['/public/inteligencia-negocio'] }
                ]
            },
            {
                label: 'Rastreo',
                items: [
                    { label: 'Geocerca', icon: 'pi pi-fw pi-compass', routerLink: ['/rastreo/geocerca'] },
                    { label: 'Monitoreo', icon: 'pi pi-fw pi-map', routerLink: ['/rastreo/monitoreo'] },
                    { label: 'Vehículos', icon: 'pi pi-fw pi-car', routerLink: ['/rastreo/vehiculo'] }
                    
                ]
            },
            {
                label: 'Reportes',
                items: [
                    { label: 'Estadísticas', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/reportes/estadisticas'] },
                    { label: 'Eventos', icon: 'pi pi-fw pi-calendar', routerLink: ['/reportes/eventos'] },
                    { label: 'Rutas', icon: 'pi pi-fw pi-map-marker', routerLink: ['/reportes/rutas'] }
                    
                ]
            },
            {
                label: 'Seguridad',
                items: [
                    { label: 'Personas', icon: 'pi pi-fw pi-users', routerLink: ['/seguridad/persona'] },
                    { label: 'Roles', icon: 'pi pi-fw pi-key', routerLink: ['/seguridad/rol'] },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/seguridad/usuario'] }
                    
                ]
            },
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'UI Components',
                items: [
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                    { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
                    { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'Prime Blocks',
                items: [
                    { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
                    { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
                ]
            },
            {
                label: 'Utilities',
                items: [
                    { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
                    { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Timeline',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/timeline']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    },
                ]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
                    }
                ]
            }
        ]; 

        */
        //console.log("llego",this.model);
    }
    CargarMenuPublico(){
        
        this.model.push(
        {
            label: 'Publico',
            items: [
                { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/public/inicio'] },
                { label: 'Sobre Nosotros', icon: 'pi pi-fw pi-users', routerLink: ['/public/sobre-nosotros'] },
                { label: 'Contacto', icon: 'pi pi-fw pi-phone', routerLink: ['/public/contacto'] }
                
            ]
        },
        {
            label: 'Servicios',
            items: [
                { label: 'Rastreo Satelital', icon: 'pi pi-fw pi-map-marker', routerLink: ['/public/rastreo-satelital'] },
                { label: 'Desarrollo de Software', icon: 'pi pi-fw pi-globe', routerLink: ['/public/desarrollo-software'] },
                { label: 'Inteligencia de negocios', icon: 'pi pi-fw pi-chart-line', routerLink: ['/public/inteligencia-negocio'] }
            ]
        },
        /*
        {
            label: 'UI Components',
            items: [
                { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
                { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
                { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
            ]
        },
        */

        
        // {
        //     label: 'Rastreo',
        //     items: [
        //         { label: 'Geocerca', icon: 'pi pi-fw pi-compass', routerLink: ['/rastreo/geocerca'] },
        //         { label: 'Monitoreo', icon: 'pi pi-fw pi-map', routerLink: ['/rastreo/monitoreo_vehiculo'] },
        //         { label: 'Vehículos', icon: 'pi pi-fw pi-car', routerLink: ['/rastreo/vehiculo'] }
                
        //     ]
        // },
        );
 
    }
    CargarMenuUsuario(){
        
        if(localStorage.getItem('accesos') != undefined ){
            let menu_aux=JSON.parse(localStorage.getItem('accesos')|| '{}').accesos.original.replaceAll('expandedicon','expandedIcon');
            menu_aux=menu_aux.replaceAll('collapsedicon','collapsedIcon');
            //menu_aux=menu_aux.replaceAll('items','children');
            menu_aux=menu_aux.replaceAll('ruta_menu_sidebar','routerLink');

           
            

            let menu=JSON.parse(menu_aux).items;

            for (let index = 0; index < menu.length; index++) {
                //const element = array[index];
                
                
                //menu[index].items[1].routerLink='/rastreo/monitoreo_vehiculo';

                let menu2 =menu[index];
                for (let index2 = 0; index2 < menu2.items.length; index2++) {
                    
                    menu[index].items[index2]={
                        label:menu[index].items[index2].label,
                        //items:menu[index].items,
                        routerLink:menu[index].items[index2].routerLink
                    };

                }

                //console.log(menu[index].items[index]);
                
                let array= {
                    label:menu[index].label,
                    items:menu[index].items
                };
                
                //console.log("menu usuario3",menu[index]);
                // let array = this.EditarMenu(menu[index],0);
                 this.model.push(array);
                
                
            }
            //this.model.push(JSON.parse(menu_aux).items);
            // this.files=JSON.parse(menu_aux).children;
            // this.visibleSidebar1=true;
            // this.expandAll();
        }

    }
    EditarMenu(menu:any,pos:number){
        
       
        if(menu.items.length==0){

           

            return menu;

        }else{
            
            pos++;
            this.EditarMenu(menu,pos);
        }

    }
}
