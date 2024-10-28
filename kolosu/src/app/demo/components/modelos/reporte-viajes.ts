import { DateTime } from 'luxon';
import { ApiService } from './../servicios/api.service';

export class ReporteViajesModelo {

    startPositionId:number=0;
    distance:number=0;
    averageSpeed:number=0;
    maxSpeed:number=0;
    startTime: Date;
    endTime:Date;
    duration:string='';
    startAddress:string='';
    endAddress:string='';
    deviceId:number=0;

    constructor() {
        this.startTime = this.getStartOfMonth().toJSDate();  // Inicializa con la fecha y hora actual
        this.endTime =  this.getCurrentTime().toJSDate();  // También puedes inicializar otros campos
    }

    static columns_viajes =[
         { field: 'startPositionId', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
         { field: 'distance', header: 'Distancia', visibleTable: true, visibleForm: false, inputType: 'number', required: false },
         { field: 'averageSpeed', header: 'Velocidad promedio', visibleTable: true, visibleForm: false, inputType: 'number', required: false },
         { field: 'maxSpeed', header: 'Velocidad máxima', visibleTable: true, visibleForm: false, inputType: 'number', required: false },
         { field: 'startTime', header: 'Fecha inicio', visibleTable: true, visibleForm: false, inputType: 'datetime', required: false },
         { field: 'endTime', header: 'Fecha final', visibleTable: true, visibleForm: false, inputType: 'datetime', required: false },
         { field: 'duration', header: 'Duración', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
         { field: 'startAddress', header: 'Ubicación inicio', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
         { field: 'endAddress', header: 'Ubicación final', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
         { field: 'deviceId', header: 'DeviceId', visibleTable: false, visibleForm: false, inputType: 'number', required: false },
    ];

    static columns_filtro_viajes =[
         { field: 'startPositionId', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
         { field: 'startTime', header: 'Fecha inicio', visibleTable: true, visibleForm: true, inputType: 'datetime', required: true },
         { field: 'endTime', header: 'Fecha fin', visibleTable: true, visibleForm: true, inputType: 'datetime', required: true },
    ];

    getStartOfMonth(): DateTime {
        return DateTime.now().startOf('month').startOf('day');
    }
    getCurrentTime(): DateTime {
        return DateTime.now().endOf('day');
    }

}
