import { ApiService } from './../servicios/api.service';
import { DateTime, IANAZone } from 'luxon';

export class MOnitoreoModelo {
    id_dispositivo:number=0;
    fecha: Date =this.getCurrentTime().toJSDate()
    hora_inicio: Date = this.getStartOfMonth().toJSDate();
    hora_fin: Date = this.getCurrentTime().toJSDate(); 


    static columnas_vehiculos = [
        
         { field: 'id_vehiculo', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
         { field: 'placa', header: 'Dispositivo', visibleTable: true, visibleForm: true, inputType: 'text', required: true }
       
    ];


    // static columns_rutas = [
        
    //     { field: 'device_id', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
    //     { field: 'fecha', header: 'Fecha', visibleTable: true, visibleForm: true, inputType: 'date', required: true },
    //     { field: 'hora_inicio', header: 'Hora inicio', visibleTable: true, visibleForm: true, inputType: 'time', required: true },
    //     { field: 'hora_fin', header: 'Hora fin', visibleTable: true, visibleForm: true, inputType: 'time', required: true },
       
    // ];
    
    
    getStartOfMonth(): DateTime {
        return DateTime.now().startOf('month').startOf('day');
    }
    getCurrentTime(): DateTime {
        return DateTime.now().endOf('day');
    }

    // static columns_viaje =[
    //     { field: 'device_id', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
    //     { field: 'fecha_inicio', header: 'Fecha inicio', visibleTable: true, visibleForm: true, inputType: 'datetime', required: true },
    //     { field: 'fecha_fin', header: 'Fecha fin', visibleTable: true, visibleForm: true, inputType: 'datetime', required: true },
    // ];

    // static columns_parqueo =[
    //     { field: 'device_id', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
    //     { field: 'fecha_inicio', header: 'Fecha inicio', visibleTable: true, visibleForm: true, inputType: 'datetime', required: true },
    //     { field: 'fecha_fin', header: 'Fecha fin', visibleTable: true, visibleForm: true, inputType: 'datetime', required: true },
    // ];

}
