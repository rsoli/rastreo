import { Component, AfterViewInit, OnDestroy, ViewChild,ChangeDetectionStrategy, ChangeDetectorRef, ElementRef  } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DateTime, IANAZone } from 'luxon';
import { DispositivoModelo } from '../../modelos/dispositivo-modelo';
import { MapService } from '../../servicios/map.service';
import { TraccarService } from '../../servicios/traccar.service';
import { WebSocketService } from '../../servicios/web-socket.service';
import { MOnitoreoModelo } from '../../modelos/monitoreo-modelo';
import { ReporteRutasModelo } from '../../modelos/reporte-rutas';
import { ReporteParqueosModelo } from '../../modelos/reporte-parqueos';
import { ReporteViajesModelo } from '../../modelos/reporte-viajes';
import { OverlayPanelDinamicoComponent } from 'src/app/shared/overlay-panel-dinamico/overlay-panel-dinamico.component';
import { Duration } from 'luxon'; 
import { Router } from '@angular/router';



@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss'],
  providers: [MessageService,ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoreoComponent implements AfterViewInit, OnDestroy {

  loading = true;

  private token!: string;
  private socketSubscription!: Subscription;
  vehiculo_seleccionado: any | null = null;

  toolbarButtons=new Array();

  /////////filtros dinamicos////////////////////
  columns_filtros:any=[]; 
  modal_filtros:boolean=false;
  selectedFiltros={};
  titulo_filtro='';
  tipo_filtro='';
  // subtitleModal1:String="";
  subtitleModal2:String="";
  //////////////tabla de reporte en modal dinamico///////
  columns_report:any=[{field: 'device_id',primaryKey: true}]; //inicia la variable por requerimiento del framework kolosu
  modal_reporte:boolean=false;
  lista_reportes: any | null = null;
  titulo_boton_reporte='';
  /////////////////vehiculos///////////////////////////
  columnas_vehiculos = MOnitoreoModelo.columnas_vehiculos;
  buttons_vehiculo=new Array();
  lista_dispositivos:any[] = [];
  @ViewChild('vehicleOverlay') vehicleOverlay!: OverlayPanelDinamicoComponent;
  ///////////////////////////////////////////////////////////

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  
  constructor(
    private cd: ChangeDetectorRef, 
    private mapService: MapService,
    private authService: TraccarService,
    private webSocketService: WebSocketService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) {}

  async ngAfterViewInit(): Promise<void> {

    try {
      
      this.token = await this.getToken();
      this.lista_dispositivos = this.mapService.lista_dispositivos;

      if (this.token) {

        this.authService.post_iniciar_sesion(this.token).subscribe({
          next: () => {

            this.AgregarBotones();
            this.agregarBotonesVehiculo();
            this.mapService.setVehicleOverlay(this.vehicleOverlay);
            this.iniciarMapa();
            this.connectToSocket();
            this.EscuchaErroresServicio();
            this.escuchaReporteComoLlegar();
            this.mapService.observeMapContainerResize(this.mapContainer);

          },
          error: (error) => {
            // Verificar si el error es por falta de conexión
            if (this.isConnectionError(error)) {
              console.log("ERROR AL INICIAR SESIÓN: No hay conexión a Internet"); //tambein controla el servicio interceptor
            } else {
              // Aquí puedes decidir si quieres borrar el token o no
              localStorage.removeItem("accesos");
              this.router.navigate(['/auth/login']);
            }

            this.cerrarLoading();
          }
        });



      } else {

        this.cerrarLoading();
        // this.router.navigate(['/rastreo/monitoreo_vehiculo']); 
        localStorage.removeItem("accesos");
        this.router.navigate(['/auth/login']); 

      }

    } catch (error) {

      console.error('Error fetching token:', error);
      this.cerrarLoading();

    }

  }
  private isConnectionError(error: any): boolean {
    return !navigator.onLine || error.status === 0; // Puedes personalizar esta lógica
  }
  EscuchaErroresServicio(){
    this.mapService.error$.subscribe((error: string) => {
      this.MensajeError(error);
    });
  }
  escuchaReporteComoLlegar(){
    this.mapService.reportComoLlegar$.subscribe((data: string) => {
      this.titulo_boton_reporte=data;
      this.lista_reportes=0;
      this.tipo_filtro=(this.tipo_filtro=='como_llegar')?'como_llegar':'mi_ubicacion';
      this.cd.markForCheck();
      // console.log("llego data ",data);
      
    });
  }
  confirmarReconexion() {
    this.confirmationService.confirm({
        message: '¿Desea volver a intentar?',
        header: 'Conexión fallida',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          //this.abrirLoading();
          //this.webSocketService.ReiniciarContadorManual();
          // this.connectToSocket();
          window.location.reload();

        },
        reject: (type:any) => {
            switch (type) {
                case ConfirmEventType.REJECT:
                    this.cerrarLoading();
                    this.webSocketService.ReiniciarContadorManual();
                    localStorage.removeItem("accesos");
                    this.router.navigate(['/auth/login']); 
                    break;
                case ConfirmEventType.CANCEL:
                    this.cerrarLoading();
                    this.webSocketService.ReiniciarContadorManual();
                    localStorage.removeItem("accesos");
                    this.router.navigate(['/auth/login']); 
                    // this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'Operación cancelada' });
                    break;
            }
        }
    });
  }
  async onButtonVehiculosClick(event: { action: string; rowData: any }) {
    // console.log('Acción:', event.action, 'Datos de la fila:', event.rowData);
    // Aquí puedes manejar las acciones de edición o eliminación

    if(event.action=='ActivarRutas'){

      this.abrir_filtros('rutas');
      this.mapService.borrarRutaComoLlegarRestaurarTodo();

    }else if(event.action=='ActivarViajes'){

      this.abrir_filtros('viajes');
      this.mapService.borrarRutaComoLlegarRestaurarTodo();

    }else if(event.action=='ActivarParqueos'){

      this.abrir_filtros('parqueos');
      this.mapService.borrarRutaComoLlegarRestaurarTodo();

    }else if(event.action=='ActivarComoLlegar'){

      this.borrarContendioMapa();
      if(this.mapService.MarkerSeleccionado){
        const latLng = this.mapService.MarkerSeleccionado.getLatLng();
        const lat = latLng.lat; // Obtener la latitud
        const lon = latLng.lng; // Obtener la longitud
        
        this.abrirLoading();
        this.vehicleOverlay.closeOverlay();
        this.mapService.agregarBotonUbicacionActual2(this.vehiculo_seleccionado.placa);
        this.tipo_filtro='como_llegar';
        await this.sleep(3000); 
        this.mapService.activarBanderaTrazarComoLlegar();//se debe activar antes de trazar la ruta
        this.mapService.trazarRutaComoLlegar(lat, lon); 
        this.mapService.centrarMiUbicacion();
        this.cerrarLoading();
      }


    }
    else{

    }

  }
  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  seleccionarVehiculo(event:any){

    this.vehiculo_seleccionado=event;
    this.borrarContendioMapa();
    this.mapService.seleccionaMarker(this.vehiculo_seleccionado);

    this.ButtonOverlayEnabled('btnRutas', false);
    this.ButtonOverlayEnabled('btnViajes', false);
    this.ButtonOverlayEnabled('btnParqueos', false);
    this.ButtonOverlayEnabled('btnComoLlegar', false);
    
  }
  deshacerSeleccionVehiculo(event:any){
    // console.log("deshacer seleccion ",event);
    this.ButtonOverlayEnabled('btnRutas', true);
    this.ButtonOverlayEnabled('btnViajes', true);
    this.ButtonOverlayEnabled('btnParqueos', true);
    this.ButtonOverlayEnabled('btnComoLlegar', true);
  }
  agregarBotonesVehiculo(){

    this.buttons_vehiculo.push({
      name:"btnRutas", 
      label: 'Rutas', 
      tooltip:'Rutas',
      action: 'ActivarRutas', 
      icon: 'pi pi-map',
      disabled:true,
      class:'p-button-rounded p-button-success'
    });  
    this.buttons_vehiculo.push({
      name:"btnViajes", 
      label: 'Viajes', 
      tooltip:'Viajes',
      action: 'ActivarViajes', 
      icon: 'pi pi-compass',
      disabled:true,
      class:'p-button-rounded p-button-primary'
    });  
    this.buttons_vehiculo.push({
      name:"btnParqueos", 
      label: 'Parqueos', 
      tooltip:'Parqueos',
      action: 'ActivarParqueos', 
      icon: 'pi pi pi-car',
      disabled:true,
      class:'p-button-rounded p-button-warning'
    });  
    this.buttons_vehiculo.push({
      name:"btnComoLlegar", 
      label: 'Como llegar', 
      tooltip:'Como llegar',
      action: 'ActivarComoLlegar', 
      icon: 'pi pi-reply',
      disabled:true,
      class:'p-button-rounded p-button-secondary'
    });  
  }
  AgregarBotones(){

    this.toolbarButtons.push(
      { name:"btnOpenMarker", 
        label: 'Ver mapa', 
        tooltip:'Ver en Mapa',
        action: 'onOpenMarker', 
        icon: 'pi pi-map-marker',
        disabled:true,
        class:'p-button-rounded p-button-info'
      });  

  }
  ButtonClick(event: { action: string, rowData: any }) {

    const { action, rowData } = event;

    if (action === 'onOpenMarker') {
      
      if(this.tipo_filtro=='rutas'){

        this.mapService.AbrirPopup(rowData);
        this.cerrarModalReporte();

      }
      else if(this.tipo_filtro=='viajes'){

        this.loading=true;
        this.modal_filtros=false;
    
        this.cerrarModalReporte();

        let parametros={
          deviceId: rowData.deviceId, 
          startTime: DateTime.fromFormat(rowData.startTime, 'dd/MM/yyyy HH:mm:ss').toISO(), //convertimos la fecha al formato traccar
          endTime: DateTime.fromFormat(rowData.endTime, 'dd/MM/yyyy HH:mm:ss').toISO(),  //convertimos la fecha al formato traccar
        };
    
        this.mapService.GetRutasTraccar(parametros).then(
          rutas => {
            this.cerrarLoading();
          },
          error => {
            console.error('Error al obtener viajes:', error);
            this.cerrarLoading();
            this.modal_filtros=true;
          }
        );

      }
      else if(this.tipo_filtro=='parqueos'){

        this.mapService.AbrirPopup({id:rowData.positionId});
        this.cerrarModalReporte();

      }

    } 
    else {
      console.error('Acción no soportada');
    }  
  
  }
  cerrarModalReporte(): void{
    this.modal_reporte=false;
  }

  seleccionarReporte(data:any){
    // this.messageService.clear();
    // this.MensajeInfo(data.persona,true);

    if(data.isSummary===true){
      this.ButtonEnabled('btnOpenMarker', true); //inactiva
    }else{
      this.ButtonEnabled('btnOpenMarker', false);//activa
    }
    // console.log("ver data ",data);
    

    
  }
  deshacerSeleccionReporte(data:any){

    this.ButtonEnabled('btnOpenMarker', true);
    
  }
  abrirReporte(event: Event) {
    // Prevenir que el evento de click se dispare cuando se haga click en el icono de cerrar ("X")

    if ((event.target as HTMLElement).classList.contains('p-chip-remove-icon')) {
      return;
    }
    if(this.tipo_filtro=='mi_ubicacion'){
      this.mapService.centrarMiUbicacion();
      return;
    }
    if(this.tipo_filtro=='como_llegar'){
      // this.mapService.abrirModalRuta();
      this.mapService.centrarMiUbicacion();
      return;
    }
  
    this.modal_reporte=true;
  }
  cerrarLoading(){

    this.loading=false;
    this.cd.markForCheck();
    //se esta usando de esta foma para que reconozca el close loading por que se esta usando la carga de tabla segun lo que se valla visualizando asi evitar lentitud de carga en tabla y movimineto de mapa
    //ChangeDetectionStrategy, ChangeDetectorRef         complemento usados
  }
  abrirLoading(){

    this.loading=true;
    this.cd.markForCheck();

  }
  cerrarReporte(event: MouseEvent) {
    /*
    event.stopPropagation(); // Detener la propagación del evento click
    this.borrarContendioMapa();
    this.mapService.borrarRutaComoLlegarRestaurarTodo();

    this.abrirLoading(); // Abre el loading antes de iniciar
    this.mapService.showTooltips().then(() => {
        this.cerrarLoading(); // Cierra el loading una vez que showTooltips ha terminado
    });*/
    if ((event.target as HTMLElement).classList.contains('p-chip-remove-icon')) {
      return;
    }

    // Detener la propagación del evento
    event.stopPropagation();
    
    // Abrir el loading
    this.abrirLoading();
    
    // Usar un setTimeout para permitir que el loading se muestre
    this.borrarContendioMapa();
    this.mapService.borrarRutaComoLlegarRestaurarTodo();

    // Llamada a showTooltips y cierre del loading
    //if(this.tipo_filtro=='como_llegar' || this.tipo_filtro=='viajes' || this.tipo_filtro=='rutas' || this.tipo_filtro=='parqueos'  ){
      this.mapService.showTooltips().then(() => {
        this.cerrarLoading(); 
      });
    //}

  }
  borrarContendioMapa(){

    this.mapService.borrarMarcadores();
    this.lista_reportes=null;

  }
  iniciarMapa(){
    this.mapService.iniciarVariables();
    this.mapService.cargarIcono();
    this.mapService.initializeMap('map4');
    this.mapService.agregarBotonVehiculo();
    this.mapService.agregarBotonTipoMapa();
    this.mapService.agregarBotonUbicacionActual();
   
    // this.mapService.removeDefaultLayersControl();
    this.lista_dispositivos = this.mapService.lista_dispositivos;
  }
  connectToSocket(): void {

    this.socketSubscription = this.webSocketService.connect().subscribe({
      next: (message) => {
        // console.log('Mensaje recibido: ', message);
        this.mapService.AgregarMarcador(message);
        // this.EscucharCambioListaVehiculo();
      },
      error: (error) => {
        // console.error('Error en el WebSocket: ', error);
        console.log('Error en el WebSocket: ',error);
        // El retryWhen en el servicio ya maneja la reconexión automática
      },
      complete: () => {
        // window.location.reload();
        this.connectToSocket();  //vuelve a conectar al socket  en algunos casos al volver desde otro componente la conexion empieza cerrado
        console.log('Conexión cerrada');
      }

    });

    // Manejar el evento de error de conexión
    this.webSocketService.getConnectionErrorObservable().subscribe(() => {
      // console.error('Se alcanzaron los intentos máximos de reconexión.');
      console.log('Se alcanzaron los intentos máximos de reconexión');
      this.cerrarLoading();
      //this.confirmarReconexion(); 
      window.location.reload();
    });

    // Suscribirse al estado de conexión
    this.webSocketService.getConnectionStatusObservable().subscribe((connected: boolean) => {
      // this.isConnected = connected;
      if(connected){
        this.cerrarLoading();
        // console.log("Conexion exitosa ",connected);
      }else{
        console.log("Conexion fallida");
        this.abrirLoading();
      }
      
    });

  }
  ngOnDestroy(): void {
    // Cancelar la suscripción al socket si existe
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  
    // Verificar si el WebSocket está inicializado antes de cerrarlo
    if (this.webSocketService && this.webSocketService.isConnected()) {
      this.webSocketService.close();
    } else {
      console.log('El WebSocket no está inicializado o ya está cerrado');
    }
  
    // Remover los marcadores del mapa
    this.mapService.removeAllMarkers(); 
  }   
  BorrarToast() {
    this.messageService.clear();
  }
  private getToken(): string {
    // Intenta obtener el objeto 'accesos' del localStorage
    const accesos = localStorage.getItem('accesos');
  
    // Si no existe, o si no se puede parsear, retorna una cadena vacía
    if (!accesos) {
      return '';
    }
  
    // Parsear el objeto y obtener el token, devolviendo cadena vacía si no existe
    return JSON.parse(accesos).token_socket || '';
  }
  seleccionar_ruta(ruta:any){
    this.mapService.AbrirPopup(ruta);
  }
  convertirFechaReporte(fecha: string): string {
    // Parsear la fecha en formato nativo de JavaScript
    const date = DateTime.fromJSDate(new Date(fecha), { zone: 'America/La_Paz' });

    // Formatear la fecha en el formato deseado
    return date.toFormat('dd/LL/yyyy HH:mm');
  }
  abrir_filtros(datos:string){

    this.borrarContendioMapa();
    let tipo_reporte_aux=this.capitalizarTexto(datos);
    this.titulo_boton_reporte=tipo_reporte_aux+' '+this.vehiculo_seleccionado.placa;

    this.titulo_filtro=tipo_reporte_aux+' '+this.vehiculo_seleccionado.placa;

    this.tipo_filtro = datos;//variable para cuando se ejecuta los filtros

    if (!this.vehiculo_seleccionado) {
      return;  // Salir si no hay vehículo seleccionado
    }else if(datos=='rutas'){

      // console.log("parametros  rutas",this.vehiculo_seleccionado.id_dispositivo);
      this.columns_report= ReporteRutasModelo.columns_rutas; 
      this.columns_filtros= ReporteRutasModelo.columns_filtro_rutas;
      let aux_rutas = new MOnitoreoModelo(); //iniciarmos los filtros por defecto
      this.selectedFiltros=aux_rutas; //iniciarmos los filtros por defecto

      this.modal_filtros=true;

    }
    else if(datos=='viajes'){
      this.columns_report =ReporteViajesModelo.columns_viajes;
      this.columns_filtros= ReporteViajesModelo.columns_filtro_viajes; 
      let aux_viajes = new ReporteViajesModelo(); //iniciarmos los filtros por defecto
      this.selectedFiltros=aux_viajes; //iniciarmos los filtros por defecto
      this.modal_filtros=true;

    }
    else if(datos=='parqueos'){

      this.columns_report= ReporteParqueosModelo.columns_parqueos; 
      this.columns_filtros= ReporteParqueosModelo.columns_filtro_parqueos; 
      let aux_parqueos = new ReporteParqueosModelo(); //iniciarmos los filtros por defecto
      this.selectedFiltros=aux_parqueos; //iniciarmos los filtros por defecto
      this.modal_filtros=true;

    }
    else if(datos=='opciones'){

    }
    

  }
  aplicarFiltro(monitoreo:any){   

    this.mapService.cerrarOverlay();
    this.mapService.borrarRutaComoLlegarRestaurarTodo();

    if(this.tipo_filtro=='rutas'){

        this.aplicarRutas(monitoreo);

    }else if(this.tipo_filtro=='viajes'){

      this.aplicarViajes(monitoreo);

    }else if(this.tipo_filtro=='parqueos'){

        this.aplicarParqueos(monitoreo);

    }
    else if(this.tipo_filtro=='opciones'){

    }


    //para subtitulo para el reporte
    let data:any=monitoreo;

    if(this.tipo_filtro=='rutas'){

      let f_ini:any;
      let f_fin:any;
  
      data.fecha.setHours(DateTime.fromJSDate(data.hora_inicio).hour,DateTime.fromJSDate(data.hora_inicio).minute,0);
      f_ini =DateTime.fromJSDate(data.fecha).toISO();
      data.fecha.setHours(DateTime.fromJSDate(data.hora_fin).hour,DateTime.fromJSDate(data.hora_fin).minute,59);
      f_fin = DateTime.fromJSDate(data.fecha).toISO();
      this.subtitleModal2='GENERADO DESDE EL '+this.convertirFechaReporte(f_ini)+' HASTA EL '+this.convertirFechaReporte(f_fin);

    }else{
      this.subtitleModal2='GENERADO DESDE EL '+this.convertirFechaReporte(data.startTime)+' HASTA EL '+this.convertirFechaReporte(data.endTime);
    }

    

  }
  public combineDateAndTime(dateString: string, timeString: string): string {
    // Convertir la cadena de fecha a un objeto Date
    const date = DateTime.fromJSDate(new Date(dateString));
    
    // Si timeString también es un formato de fecha, convertirlo a objeto Date
    const time = DateTime.fromJSDate(new Date(timeString));

    // Extraer la hora, minutos y segundos
    const hour = time.hour;
    const minute = time.minute;
    const second = time.second;

    // Combinar fecha y hora
    const combinedDateTime = date.set({ hour, minute, second });

    // Formatear la salida en el formato deseado
    return combinedDateTime.toFormat("EEE MMM dd yyyy HH:mm:ss 'GMT'Z (hh:mm)"); // Formato personalizado
  }
  aplicarRutas(data:any){

    let f_ini;
    let f_fin;

    data.fecha.setHours(DateTime.fromJSDate(data.hora_inicio).hour,DateTime.fromJSDate(data.hora_inicio).minute,0);
    f_ini =DateTime.fromJSDate(data.fecha).toISO();
    data.fecha.setHours(DateTime.fromJSDate(data.hora_fin).hour,DateTime.fromJSDate(data.hora_fin).minute,59);
    f_fin = DateTime.fromJSDate(data.fecha).toISO();

    this.abrirLoading();
    this.modal_filtros=false;

    let parametros={
      deviceId: this.vehiculo_seleccionado.id_dispositivo, 
      startTime: f_ini, 
      endTime: f_fin,
      centrar_parqueo: data.parqueo?true:false  //para dibujar en parqueos 
    };

    this.mapService.GetRutasTraccar(parametros).then(
      rutas => {

        //  console.log("datos rutas",rutas);
        if(rutas.length==0){
          
          this.lista_reportes=null;
          this.modal_filtros=true;
          this.cerrarLoading();
          this.MensajeAlerta("Rutas no encontrada");

        }else{
          let totalDistancia = 0;
          // console.log("ver datos rutas ",rutas);
          
          // this.lista_reportes = rutas; //la variable rutas es la respuesta de la api donde se encuentra attributes
          this.lista_reportes = rutas.map((ruta: any) => {
            const speedInKmh = Math.round(ruta.speed * 1.852) + ' Km/h';
            const powerInVolt = Math.round(ruta.attributes?.power) + ' Volt.' || '';
            // const batteryInVolt = Math.round(ruta.attributes?.battery) + ' Volt.' || '';
            const distance = Math.round(ruta.attributes.distance)+' Mts.';
            const ignitionStatus = ruta.attributes.ignition ? 'Encendido' : 'Apagado';
            const distanceInMeters = Math.round(ruta.attributes?.distance); //par total de distancia recorrida
            // Sumar la distancia recorrida
            totalDistancia += distanceInMeters;

            return {
              ...ruta,
              deviceTime: this.convertirFecha(ruta.deviceTime),
              speed: speedInKmh,
              power: powerInVolt,
              // battery: batteryInVolt,
              distance :distance,
              ignition: ignitionStatus
            };
          });

          // Convertimos la distancia total de metros a kilómetros
          const totalDistanciaKm = (totalDistancia / 1000).toFixed(2) + ' Km';

          // Agregamos un nuevo objeto al final del arreglo con el total de la distancia
          this.lista_reportes.push({
            deviceTime: '',
            speed: '',
            power: '',
            distance: 'Total distancia: ' + totalDistanciaKm,
            ignition: '',
            isSummary: true // para personalizar el estilo summary totales
          });


          this.mapService.ajustarTamaño();


          if(data.parqueo){
            this.aplicarParqueosConRutas(parametros);
          }else{
            this.cerrarLoading();
          }


        }
      },
      error => {
        console.error('Error al obtener rutas:', error);
        this.cerrarLoading();
        this.modal_filtros=true;
      }
    );
  }
  aplicarParqueosConRutas(data:any){

    this.mapService.GetParqueosTraccar(data).then(
      parqueos => {

        // console.log("datos parqueos",parqueos);
        if(parqueos.length==0){
          this.MensajeAlerta("Parqueos no encontrada");
          this.lista_reportes=null;
          this.modal_filtros=true;
        }
        this.cerrarLoading();
      },
      error => {
        console.error('Error al obtener parqueos:', error);
        this.cerrarLoading();
        this.modal_filtros=true;
      }
    );
  }
  aplicarViajes(data:ReporteViajesModelo){

    let f_ini;
    let f_fin;

    f_ini =DateTime.fromJSDate(data.startTime).toISO();
    f_fin = DateTime.fromJSDate(data.endTime).toISO();

    this.abrirLoading();
    this.modal_filtros=false;

    let parametros={
      deviceId: this.vehiculo_seleccionado.id_dispositivo, 
      startTime: f_ini, 
      endTime: f_fin
    };
    // console.log("viajes param",parametros);
    
    this.mapService.GetViajesTraccar(parametros).then(
      viajes => {

        // console.log("datos",viajes);
        if(viajes.length==0){
          this.MensajeAlerta("Viaje no encontrada");
          this.lista_reportes=null;
          this.modal_filtros=true;

        }else{
          
          let totalDistancia = 0;
          this.modal_reporte=true;
          // console.log("ver datos viajes ",viajes);
          
          // this.lista_reportes = viajes; //la variable viajes es la respuesta de la api donde se encuentra attributes
          this.lista_reportes = viajes.map((viaje: any) => {
            const speedAverageInKmh = Math.round(viaje.averageSpeed * 1.852) + ' Km/h';
            const speedMaxInKmh = Math.round(viaje.maxSpeed * 1.852) + ' Km/h';
            const distanceInMeters = Math.round(viaje?.distance); //par total de distancia recorrida
            const duracion = Duration.fromMillis(viaje?.duration).shiftTo('hours', 'minutes');
            // Obtener las horas y minutos
            const horas = Math.floor(duracion.hours); // Redondear las horas
            const minutos = Math.floor(duracion.minutes); // Redondear los minutos restantes
            // Sumar la distancia recorrida
            totalDistancia += distanceInMeters;

            return {
              ...viaje,
              distance:(distanceInMeters/1000).toFixed(2)+' Km.',
              averageSpeed:speedAverageInKmh,
              maxSpeed:speedMaxInKmh,
              startTime: this.convertirFecha(viaje.startTime),
              endTime:this.convertirFecha(viaje.endTime),
              duration:`${horas} h ${minutos} m`,

            };
          });

          // Convertimos la distancia total de metros a kilómetros
          const totalDistanciaKm = (totalDistancia / 1000).toFixed(2) + ' Km';

          // Agregamos un nuevo objeto al final del arreglo con el total de la distancia
          this.lista_reportes.push({
            distance: 'Total distancia: ' + totalDistanciaKm,
            averageSpeed: '',
            maxSpeed: '',
            startTime: '',
            endTime:'',
            duration:'',
            isSummary: true // para personalizar el estilo summary totales
          });

          this.mapService.ajustarTamaño();
        }
        this.cerrarLoading();
      },
      error => {
        console.error('Error al obtener viaje:', error);
        this.cerrarLoading();
        this.modal_filtros=true;
      }
    );

  }
  aplicarParqueos(data:any){
    
    this.abrirLoading();

    let f_ini;
    let f_fin;

    f_ini =DateTime.fromJSDate(data.startTime).toISO();
    f_fin = DateTime.fromJSDate(data.endTime).toISO();

    this.loading=true;
    this.modal_filtros=false;
    

    let parametros={
      deviceId: this.vehiculo_seleccionado.id_dispositivo, 
      startTime: f_ini, 
      endTime: f_fin,
      centrar_parqueo:false
    };

    this.mapService.GetParqueosTraccar(parametros).then(
      parqueos => {

        // console.log("datos parqueos",parqueos);
        if(parqueos.length==0){
          this.MensajeAlerta("Parqueos no encontrada");
          this.lista_reportes=null;
          this.modal_filtros=true;
        }else{

          this.lista_reportes = parqueos.map((parqueo: any) => {
            const duracion = Duration.fromMillis(parqueo?.duration).shiftTo('hours', 'minutes');

            const horas = Math.floor(duracion.hours); // Redondear las horas
            const minutos = Math.floor(duracion.minutes); // Redondear los minutos restantes

            return {
              ...parqueo,
              startTime: this.convertirFecha(parqueo.startTime),
              endTime:this.convertirFecha(parqueo.endTime),
              duration:`${horas} h ${minutos} m`,

            };
          });

          this.mapService.ajustarTamaño();
        }
        this.cerrarLoading();
      },
      error => {
        console.error('Error al obtener parqueos:', error);
        this.cerrarLoading();
        this.modal_filtros=true;
      }
    );

  }
  convertirFecha(fechaISO: string): string {
    // Convertir la fecha ISO a DateTime de Luxon
    const fecha = DateTime.fromISO(fechaISO, { zone: 'America/La_Paz' });
    
    // Formatear la fecha a "dd/MM/yyyy HH:mm:ss"
    return fecha.toFormat('dd/MM/yyyy HH:mm:ss');
  }
  cerrarModalFiltro(): void{
    
    this.mapService.abrirOverlay(this.mapService.overlay_aux_click);
    this.modal_filtros=false; 

  }
  MensajeError(mensaje:string){
    this.messageService.add({severity:'error', summary: 'Alerta', detail: mensaje});
  }
  MensajeAlerta(mensaje:string){
    this.messageService.add({severity:'warn', summary: 'Advertencia', detail: mensaje});
  }
  capitalizarTexto(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
  getCurrentTime(): DateTime {
    return DateTime.now().endOf('day');
  }
  getStartOfMonth(): DateTime {
    return DateTime.now().startOf('month').startOf('day');
  }
  convertSpeedToKmh(speed: number): number {
    return speed * 1.852;
  }
  ButtonOverlayEnabled(name: string, disabled: boolean): void {
    this.buttons_vehiculo.forEach(btn => {
      if (btn.name === name) {
        btn.disabled = disabled;
      }
    });
  }
  ButtonEnabled(name: string, disabled: boolean): void {
    this.toolbarButtons.forEach(btn => {
      if (btn.name === name) {
        btn.disabled = disabled;
      }
    });
  }
}
