import { ApiService } from './../servicios/api.service';

export class RastreoEventosModelo {

    device_id:number=0;
    fecha:string='';
    hora_inicio:string='';
    hora_fin:string='';


    static columns_rutas =[
        { field: 'device_id', header: 'ID', visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'fecha', header: 'Fecha', visibleForm: true, inputType: 'date', required: true},
        { field: 'hora_inicio', header: 'Hora inicio', visibleForm: true, inputType: 'time', required: true },
        { field: 'hora_fin', header: 'Hora fin', visibleForm: true, inputType: 'time', required: true },
    ];

    static columns_viajes =[
        { field: 'device_id', header: 'ID', visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'fecha_inicio', header: 'Fecha inicio', visibleForm: true, inputType: 'datetime', required: true},
        { field: 'hora_fin', header: 'Fecha final', visibleForm: true, inputType: 'datetime', required: true }
    ];

    static columns_parqueos =[
        { field: 'device_id', header: 'ID', visibleForm: false, inputType: 'number', required: false, primaryKey: true },
        { field: 'fecha_inicio', header: 'Fecha inicio', visibleForm: true, inputType: 'datetime', required: true},
        { field: 'hora_fin', header: 'Fecha final', visibleForm: true, inputType: 'datetime', required: true }
    ];

}
