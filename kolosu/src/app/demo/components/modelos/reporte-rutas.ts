import { DateTime } from 'luxon';
import { ApiService } from './../servicios/api.service';

export class ReporteRutasModelo {

    positionId:number=0;
    ignition:string='';
    speed:string='';
    power:string='';
    battery:string='';
    deviceTime:string='';
    address:string='';
    distance:string='';
    

    static columns_rutas =[
        { field: 'positionId', header: 'ID', visibleForm: false, visibleTable: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'ignition', header: 'Motor', visibleForm: true, visibleTable: true, inputType: 'text', required: true},
        { field: 'speed', header: 'Velocidad', visibleForm: true, visibleTable: true, inputType: 'number', required: true},
        { field: 'power', header: 'Bateria', visibleForm: true, visibleTable: true, inputType: 'number', required: true},
        // { field: 'battery', header: 'Bateria gps', visibleForm: true, visibleTable: true, inputType: 'number', required: true},
        { field: 'distance', header: 'Distancia', visibleForm: true, visibleTable: true, inputType: 'number', required: true},
        { field: 'deviceTime', header: 'Fecha', visibleForm: true, visibleTable: true, inputType: 'date', required: true},
        { field: 'address', header: 'Ubicación', visibleForm: true, visibleTable: true, inputType: 'text', required: true},
    ];

    static columns_filtro_rutas = [
        
        { field: 'device_id', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'fecha', header: 'Fecha', visibleTable: true, visibleForm: true, inputType: 'date', required: true },
        { field: 'hora_inicio', header: 'Hora inicio', visibleTable: true, visibleForm: true, inputType: 'time', required: true },
        { field: 'hora_fin', header: 'Hora fin', visibleTable: true, visibleForm: true, inputType: 'time', required: true },
        { field: 'parqueo', header: '¿Mostrar parqueos?', visibleTable: true, visibleForm: true, inputType: 'checkbox', required: false },
       
    ];
    

    getStartOfMonth(): DateTime {
        return DateTime.now().startOf('month').startOf('day');
    }
    getCurrentTime(): DateTime {
        return DateTime.now().endOf('day');
    }

}
