"use strict";(self.webpackChunkkolosu=self.webpackChunkkolosu||[]).push([[9857],{9857:(M,f,s)=>{s.r(f),s.d(f,{TaxiComponentModule:()=>P});var u=s(6895),d=s(7046),m=s(805);let x=(()=>{class i{constructor(){this.id_taxi=0}static initialize(e){}static ComboPersona(e){e.getAll("persona/lista_persona").subscribe({next:o=>{const c=(o.personas||[]).map(p=>({label:p.nombre+" "+p.apellido_paterno+" "+p.apellido_materno,value:p.id_persona})),l=i.columns.find(p=>"id_persona"===p.field);l&&(l.options=c)},error:o=>{console.error("Error cargando opciones de persona",o)}})}}return i.columns=[{field:"id_taxi",header:"ID",visibleTable:!1,visibleForm:!1,inputType:"number",required:!1,primaryKey:!0},{field:"id_persona",header:"Persona",visibleTable:!1,visibleForm:!0,inputType:"select",required:!1,options:[],multiple:!1}],i})();var r=s(8407),a=(s(1554),s(1837)),t=s(1571),v=s(6253),g=s(433),y=s(5593),_=s(1740);function k(i,h){if(1&i&&(t.TgZ(0,"div",8),t._uU(1),t.qZA()),2&i){const e=t.oxw();t.xp6(1),t.hij("",e.distancia," Km.")}}const b=r.Icon.Default.prototype;b.options.iconUrl="assets/leaflet/images/marker-icon.png",b.options.iconRetinaUrl="assets/leaflet/images/marker-icon-2x.png",b.options.shadowUrl="assets/leaflet/images/marker-shadow.png";const A=[{path:"",component:(()=>{class i{constructor(e,o,n){this.apiService=e,this.messageService=o,this.router=n,this.loading=!1,this.lista_taxi=[],this.columnas_taxi=x.columns,this.toolbarButtons=new Array,this.index_ubicacion_actual=0,this.markers=[],this.distanciaRecorrida=0,this.contador_mi_ubicacion_actual=0,this.desde="",this.hasta="",this.distancia="",this.icono_mi_ubicacion=r.icon({iconUrl:"assets/icons/mi-ubicacion.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]})}ngAfterViewInit(){this.map=r.map("map",{zoomControl:!1,attributionControl:!1}).setView([-16.290154,-63.588653],5),r.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18}).addTo(this.map),r.control.zoom({position:"bottomright"}).addTo(this.map),this.ObtenerUbicacionActual(),this.map.on("move",()=>{const e=this.map.getCenter();this.obtenerCoordenadas(e.lat,e.lng)})}obtenerCoordenadas(e,o){this.desde=`${e.toFixed(5)}, ${o.toFixed(5)}`,this.markers[this.index_ubicacion_actual]?this.markers[this.index_ubicacion_actual].setLatLng([e,o]):console.warn("El marcador a\xfan no ha sido inicializado."),console.log(`Ubicaci\xf3n seleccionada: ${this.desde}`)}ObtenerUbicacionActual(){navigator.geolocation?this.watchId=navigator.geolocation.watchPosition(e=>{const o=e.coords.latitude,n=e.coords.longitude,l=a.ou.now().setZone("local").toFormat("dd/LL/yyyy HH:mm:ss");this.markers[this.index_ubicacion_actual]||(this.markers[this.index_ubicacion_actual]=r.marker([o,n]).addTo(this.map).bindPopup(`Mi ubicaci\xf3n<br>Fecha: ${l}`).openPopup(),this.contador_mi_ubicacion_actual++,1==this.contador_mi_ubicacion_actual&&this.map.setView([o,n],15)),this.desde=`${o.toFixed(5)}, ${n.toFixed(5)}`},e=>{console.error("Error al obtener la ubicaci\xf3n: ",e),this.messageService.add({severity:"error",summary:"Error",detail:"Ubicaci\xf3n no encontrada, por favor, verifica tu dispositivo."})},{enableHighAccuracy:!0,timeout:5e3,maximumAge:0}):console.error("Geolocalizaci\xf3n no soportada en este navegador")}setMarker(e){const o=this.map.getCenter();"desde"===e||(this.hastaMarker&&this.map.removeLayer(this.hastaMarker),this.hastaMarker=this.createDraggableMarker(o,"Final").addTo(this.map),this.hastaMarker.on("dragend",()=>{const{lat:n,lng:c}=this.hastaMarker.getLatLng();this.hasta=`${n.toFixed(5)}, ${c.toFixed(5)}`,this.requestTaxi()}))}createDraggableMarker(e,o){const n=r.marker(e,{draggable:!0});return n.bindTooltip(o,{permanent:!0,direction:"top",className:"custom-tooltip"}),n}centerMap(e,o,n,c){const l=r.latLngBounds([[e,o],[n,c]]);this.map.fitBounds(l)}requestTaxi(){if(this.map.off("move"),this.desde&&this.hasta){const[e,o]=this.desde.split(",").map(Number),[n,c]=this.hasta.split(",").map(Number);this.trazarRuta(e,o,n,c),this.centerMap(e,o,n,c),console.log(`Solicitando taxi desde ${this.desde} hasta ${this.hasta}`),this.messageService.add({severity:"success",summary:"Solicitud de Taxi",detail:"Taxi solicitado exitosamente."})}else this.messageService.add({severity:"error",summary:"Error",detail:"Por favor, completa ambas ubicaciones."})}trazarRuta(e,o,n,c){if(!this.desde||!this.hasta)return void console.error("Ambos puntos deben estar definidos para trazar la ruta.");const l=r.latLng(e,o),p=r.latLng(n,c);this.routingControl&&this.map.removeControl(this.routingControl),this.routingControl=r.Routing.control({waypoints:[l,p],routeWhileDragging:!1,router:r.Routing.osrmv1({serviceUrl:"https://router.project-osrm.org/route/v1",language:"es"}),lineOptions:{styles:[{color:"#20B7F6",opacity:1,weight:6}],extendToWaypoints:!0,missingRouteTolerance:0},show:!1}).addTo(this.map),this.routingControl.on("routesfound",U=>{const T=U.routes;T.length>0&&(this.distancia=(T[0].summary.totalDistance/1e3).toFixed(2),this.distanciaRecorrida+=parseFloat(this.distancia),this.messageService.add({severity:"info",summary:"Distancia Recorrida",detail:`Total: ${this.distancia} Kilometros`}))})}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(v.s),t.Y36(m.ez),t.Y36(d.F0))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-taxi"]],features:[t._Bn([m.ez])],decls:8,vars:3,consts:[[1,"card"],[1,"map-container"],[1,"input-container"],["placeholder","Desde","type","text","pInputText","",3,"ngModel","ngModelChange","click"],["placeholder","Hasta","type","text","pInputText","",3,"ngModel","ngModelChange","click"],["class","distancia",4,"ngIf"],["pButton","","type","button","label","Solicitar Taxi",3,"click"],["id","map","leaflet",""],[1,"distancia"]],template:function(e,o){1&e&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"input",3),t.NdJ("ngModelChange",function(c){return o.desde=c})("click",function(){return o.setMarker("desde")}),t.qZA(),t.TgZ(4,"input",4),t.NdJ("ngModelChange",function(c){return o.hasta=c})("click",function(){return o.setMarker("hasta")}),t.qZA(),t.YNc(5,k,2,1,"div",5),t.TgZ(6,"button",6),t.NdJ("click",function(){return o.requestTaxi()}),t.qZA()(),t._UZ(7,"div",7),t.qZA()()),2&e&&(t.xp6(3),t.Q6J("ngModel",o.desde),t.xp6(1),t.Q6J("ngModel",o.hasta),t.xp6(1),t.Q6J("ngIf",o.distancia))},dependencies:[u.O5,g.Fj,g.JJ,g.On,y.Hq,_.o],styles:[".map-container[_ngcontent-%COMP%]{position:relative;height:500px}.input-container[_ngcontent-%COMP%]{position:absolute;top:10px;left:10px;z-index:1000;display:flex;flex-direction:column;gap:10px;background-color:#fff;border-radius:8px;padding:15px;box-shadow:0 2px 8px #0003}.input-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;border:1px solid #ccc;border-radius:4px;padding:8px}.input-container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:100%;border-radius:4px;padding:10px}.input-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{border-color:#007adf;outline:none}#map[_ngcontent-%COMP%]{height:100%;width:100%}@media (max-width: 600px){.input-container[_ngcontent-%COMP%]{width:90%;left:5%;right:5%}}[_nghost-%COMP%]     .leaflet-control-container .leaflet-routing-container{display:none!important}"]}),i})()}];let z=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[d.Bz.forChild(A),d.Bz]}),i})();var O=s(1511);let P=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[u.ez,g.u5,g.UX,z,O.m]}),i})()},6253:(M,f,s)=>{s.d(f,{s:()=>x});var u=s(529),d=s(2340),m=s(1571);let x=(()=>{class r{constructor(a){this.http=a,this.baseUrl="",this.token=""}actualizarAccesos(){this.token=JSON.parse(localStorage.getItem("accesos")||"{}").access_token,this.headers_token={headers:new u.WM({"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest",Authorization:`Bearer ${this.token}`})}}getAll(a){return this.actualizarAccesos(),this.http.get(a=d.N.apiUrl+"/"+a,{headers:this.headers_token.headers,observe:"body"})}getById(a,t){return this.actualizarAccesos(),this.http.get(`${a=d.N.apiUrl+"/"+a}/${t}`,{headers:this.headers_token.headers,observe:"body"})}create(a,t){return this.actualizarAccesos(),this.http.post(a=d.N.apiUrl+"/"+a,t,{headers:this.headers_token.headers,observe:"body"})}update(a,t,v){return this.actualizarAccesos(),this.http.put(`${a=d.N.apiUrl+"/"+a}/${t}`,v,{headers:this.headers_token.headers,observe:"body"})}delete(a,t){return this.actualizarAccesos(),this.http.get(`${a=d.N.apiUrl+"/"+a}/${t}`,{headers:this.headers_token.headers,observe:"body"})}delete_aux(a,t){return this.actualizarAccesos(),this.http.delete(`${a=d.N.apiUrl+"/"+a}/${t}`,{headers:this.headers_token.headers,observe:"body"})}}return r.\u0275fac=function(a){return new(a||r)(m.LFG(u.eN))},r.\u0275prov=m.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"}),r})()}}]);