import { DateTime } from 'luxon';
import { ApiService } from './../servicios/api.service';

export class ReporteParqueosModelo {

    positionId:number=0;
    startTime: Date;
    endTime:Date;
    duration:string='';
    address:string='';

    constructor() {
        this.startTime = this.getStartOfMonth().toJSDate();  // Inicializa con la fecha y hora actual
        this.endTime =  this.getCurrentTime().toJSDate();  // También puedes inicializar otros campos
    }

    static columns_parqueos =[
        { field: 'positionId', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'startTime', header: 'Fecha inicio', visibleTable: true, visibleForm: true, inputType: 'datetime', required: true },
        { field: 'endTime', header: 'Fecha final', visibleTable: true, visibleForm: true, inputType: 'datetime', required: true },
        { field: 'duration', header: 'Duración', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
        { field: 'address', header: 'Ubicación', visibleTable: true, visibleForm: false, inputType: 'text', required: false },
    ];

    static columns_filtro_parqueos =[
        { field: 'startPositionId', header: 'ID', visibleTable: false, visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'startTime', header: 'Fecha inicio', visibleTable: true, visibleForm: true, inputType: 'datetime', required: true },
        { field: 'endTime', header: 'Fecha final', visibleTable: true, visibleForm: true, inputType: 'datetime', required: true },
    ];

    getStartOfMonth(): DateTime {
        return DateTime.now().startOf('month').startOf('day');
    }
    getCurrentTime(): DateTime {
        return DateTime.now().endOf('day');
    }

}
