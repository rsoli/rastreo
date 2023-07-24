export class PagosClienteModelo {

    id_pago_servicio:number=0;
    nombre:String="";
    apellido_paterno:String="";
    apellido_materno:String="";
    ci:String="";
    celular:String="";
    fecha_pago:Date = new Date();
    fecha_inicio:Date = new Date();
    fecha_fin:Date = new Date();
    cantidad_vehiculos:number=0;
    cantidad_meses:number=0;
    precio_mensual:number=0;
    sub_total:number=0;
    id_cliente:number=0;
    mes_pagado:String="";
    tipo_servicio:String="";
}
