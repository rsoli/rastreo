"use strict";(self.webpackChunkkolosu=self.webpackChunkkolosu||[]).push([[3840],{3840:(y,l,t)=>{t.r(l),t.d(l,{GeocercaComponentModule:()=>S});var m=t(6895),n=t(7046),d=t(805);let u=(()=>{class r{constructor(){this.id=0,this.area="",this.descripcion="",this.nombre_geocerca="",this.tipo_geocerca="",this.usuario=0}static initialize(e){}}return r.columns=[{field:"id",header:"ID",visibleTable:!1,visibleForm:!1,inputType:"number",required:!1,primaryKey:!0},{field:"tipo_geocerca",header:"Tipo de Geocerca",visibleTable:!0,visibleForm:!1,inputType:"text",required:!1},{field:"nombre_geocerca",header:"Nombre de Geocerca",visibleTable:!0,visibleForm:!0,inputType:"text",required:!0},{field:"descripcion",header:"Descripci\xf3n",visibleTable:!0,visibleForm:!0,inputType:"textarea",required:!1},{field:"area",header:"\xc1rea",visibleTable:!1,visibleForm:!0,inputType:"map",required:!0},{field:"usuario",header:"Usuario",visibleTable:!0,visibleForm:!1,inputType:"text",required:!1}],r})();var i=t(1571),p=t(6253),h=t(3617),f=t(2453),v=t(1023);const g=[{path:"",component:(()=>{class r{constructor(e,a,o){this.apiService=e,this.messageService=a,this.router=o,this.loading=!1,this.lista_geocerca=[],this.columnas_geocerca=u.columns,this.toolbarButtons=new Array}ngOnInit(){this.ListarGeocerca(),u.initialize(this.apiService)}ListarGeocerca(){this.loading=!0,this.apiService.getAll("servicio/lista_geocercas").subscribe({next:e=>{this.lista_geocerca=JSON.parse(JSON.stringify(e)).lista_geocercas},error:e=>{this.MensajeError("Error al obtener la lista")},complete:()=>{this.loading=!1}})}guardarGeocerca(e){this.loading=!0,e.tipo_geocerca=JSON.parse(JSON.stringify(e.area)).tipo_geocerca,e.area=JSON.parse(JSON.stringify(e.area)).area,this.apiService.create("servicio/post_geocerca",e).subscribe({next:a=>{var o;const s=null===(o=a?.mensaje)||void 0===o?void 0:o[0];s?this.MensajeError(s):this.ListarGeocerca()},error:a=>{this.MensajeError("Verifique su conexi\ufffdn a internet")},complete:()=>{this.loading=!1}})}eliminarGeocerca(e){e.id&&(this.loading=!0,this.apiService.delete("servicio/eliminar_geocerca",e.id).subscribe({next:()=>{this.ListarGeocerca()},error:a=>{this.MensajeError("Error al eliminar")},complete:()=>{this.loading=!1}}))}seleccionarGeocerca(e){this.messageService.clear(),this.MensajeInfo(e.nombre_geocerca,!0)}deshacerSeleccionGeocerca(e){}MensajeError(e){this.messageService.add({severity:"error",summary:"Error",detail:e})}MensajeSucces(e){this.messageService.add({severity:"success",summary:"\ufffdxito",detail:e})}MensajeInfo(e,a){this.messageService.add(1==a?{severity:"info",summary:"Seleccionado",detail:e}:{severity:"info",summary:"Informaci\ufffdn",detail:e})}ButtonEnabled(e,a){this.toolbarButtons.forEach(o=>{o.name===e&&(o.disabled=a)})}}return r.\u0275fac=function(e){return new(e||r)(i.Y36(p.s),i.Y36(d.ez),i.Y36(n.F0))},r.\u0275cmp=i.Xpm({type:r,selectors:[["app-geocerca"]],features:[i._Bn([d.ez])],decls:4,vars:4,consts:[[1,"card"],[3,"loading"],["titleTable","Lista de Geocerca",3,"buttons","columns","data","selected","Unselect","formSave","delete"]],template:function(e,a){1&e&&(i.TgZ(0,"div",0),i._UZ(1,"p-toast")(2,"app-loading",1),i.TgZ(3,"app-tabla-dinamica",2),i.NdJ("selected",function(s){return a.seleccionarGeocerca(s)})("Unselect",function(s){return a.deshacerSeleccionGeocerca(s)})("formSave",function(s){return a.guardarGeocerca(s)})("delete",function(s){return a.eliminarGeocerca(s)}),i.qZA()()),2&e&&(i.xp6(2),i.Q6J("loading",a.loading),i.xp6(1),i.Q6J("buttons",a.toolbarButtons)("columns",a.columnas_geocerca)("data",a.lista_geocerca))},dependencies:[h.N,f.FN,v.C]}),r})()}];let b=(()=>{class r{}return r.\u0275fac=function(e){return new(e||r)},r.\u0275mod=i.oAB({type:r}),r.\u0275inj=i.cJS({imports:[n.Bz.forChild(g),n.Bz]}),r})();var G=t(1511);let S=(()=>{class r{}return r.\u0275fac=function(e){return new(e||r)},r.\u0275mod=i.oAB({type:r}),r.\u0275inj=i.cJS({imports:[m.ez,b,G.m]}),r})()}}]);