<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class ServicioController extends Controller
{
    public function lista_servicio(Request $request)
    {
        /*if($this->es_admin($request->user()->id)==true){
            $condicion=" where  0=0 ";
        }else{
            $condicion=" where s.id_usuario_reg = ".$request->user()->id." ";
        }*/

        $servicio=DB::select("select 
        s.id_servicio,
        s.fecha_servicio,
        s.costo_total,
        ts.tipo_servicio,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        us.name as usuario_reg,
        s.fecha_reg
        from ras.tcliente c
        join ras.tpersona p on p.id_persona=c.id_persona
        join ras.tservicio s on s.id_cliente = c.id_cliente
        join ras.ttipo_servicio ts on ts.id_tipo_servicio=s.id_tipo_servicio
        join segu.users us on us.id=s.id_usuario_reg");

        $arrayParametros=[
            'servicio'=>$servicio
        ];
        
        return response()->json($arrayParametros);

    }
    public function lista_pago_servicio($id){

        $servicio=DB::select("select ps.id_pago_servicio,
        ps.precio_mensual,
        ps.cantidad_meses,
        ps.cantidad_vehiculos,
        ps.fecha_inicio,
        ps.fecha_fin,
        us.name as usuario_reg,
        ps.fecha_pago,
        ps.sub_total
        from ras.tpago_servicio ps
        join segu.users us on us.id=ps.id_usuario_reg
        where ps.id_servicio=?",[$id]);

        $arrayParametros=[
            'pago_servicio'=>$servicio
        ]; 
        
        return response()->json($arrayParametros);
    }
    public function lista_pago_servicio_usuario(Request $request){

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" us.id in (".$request->user()->id.")";
        }

        $servicio=DB::select("
        with meses as (
            select 1 as id_periodo, 'Enero' as mes
            union all
            select 2 as id_periodo, 'Febrero' as mes
            union all
            select 3 as id_periodo, 'Marzo' as mes
            union all
            select 4 as id_periodo, 'Abril' as mes
            union all
            select 5 as id_periodo, 'Mayo' as mes
            union all
            select 6 as id_periodo, 'Junio' as mes
            union all
            select 7 as id_periodo, 'Julio' as mes
            union all
            select 8 as id_periodo, 'Agosto' as mes
            union all
            select 9 as id_periodo, 'Septiembre' as mes
            union all
            select 10 as id_periodo, 'Octubre' as mes
            union all
            select 11 as id_periodo, 'Noviembre' as mes
            union all
            select 12 as id_periodo, 'Diciembre' as mes )

                            select
                                p.nombre,
                                p.apellido_paterno,
                                p.apellido_materno,
                                p.ci,
                                p.celular,
                                ps.fecha_pago::date,
                                ps.fecha_inicio::Date,
                                ps.fecha_fin::Date,
                                ps.cantidad_vehiculos,
                                ps.precio_mensual,
                                ps.sub_total,
                                (case when extract(MONTH from ps.fecha_inicio)::integer = extract(MONTH from ps.fecha_fin)::integer then
                                mi.mes::varchar
                                else 
                                mi.mes||' - '||mf.mes
                                end)::varchar as mes_pagado
                            from  ras.tcliente c
                                join ras.tservicio s on s.id_cliente=c.id_cliente
                                join ras.tpago_servicio ps on ps.id_servicio=s.id_servicio
                                join ras.tpersona p on p.id_persona=c.id_persona
                                join segu.users us on us.id_persona=p.id_persona

                                left join meses mi on (mi.id_periodo)::integer = extract (MONTH from ps.fecha_inicio )::integer
                                left join meses mf on (mf.id_periodo)::integer = extract (MONTH from ps.fecha_fin )::integer

                            where ".$ids." and us.estado=?
                            order by p.nombre,p.apellido_paterno,p.apellido_materno,ps.fecha_inicio,ps.fecha_fin ",["activo"]);

        $arrayParametros=[
            'pago_servicio'=>$servicio
        ];

        return response()->json($arrayParametros);
    }
    public function filtros_monitoreo(Request $request){


        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" u.id = ".$request->user()->id." ";
        }

        $lista_vehiculo=DB::select("select 
                                    v.id_vehiculo,
                                    v.placa
                                    from ras.tvehiculo v
                                    inner join ras.tcliente c on v.id_cliente=c.id_cliente 	
                                    inner join ras.tpersona p on p.id_persona=c.id_persona
                                    left join segu.users u on p.id_persona=u.id_persona
                                    where ".$ids." ");

        $arrayParametros=[
            'lista_vehiculo'=>$lista_vehiculo
        ]; 
        
        return response()->json($arrayParametros);
    }
    public function monitoreo_tiempo_real(Request $request){


        $id_vehiculos=$request->id_vehiculos;

        $lista_monitoreo_tiempo_real=DB::select("select
                                    v.placa,
                                    p.latitude,
                                    p.longitude,
                                    p.address,
                                    (p.speed * 1.852)::numeric as speed,
                                    p.devicetime,
                                    p.course,
                                    p.attributes,
                                    coalesce( (p.attributes::json->'power'), (p.attributes::json->'batteryLevel') )::varchar as bateria_vehiculo
                                    from ras.tvehiculo v
                                    inner join public.tc_devices d on v.uniqueid=d.uniqueid
                                    inner join public.tc_positions p on p.id=d.positionid
                                    where v.id_vehiculo in(".$id_vehiculos.")  ");

        $arrayParametros=[
            'lista_monitoreo_tiempo_real'=>$lista_monitoreo_tiempo_real
        ]; 
        
        return response()->json($arrayParametros);
    }
    public function monitoreo_rutas(Request $request){

        $lista_monitoreo_tiempo_real=DB::select(" select  
        placa,
        latitude,
        longitude,
        address,
        speed,
        devicetime,
        course,
        bateria_vehiculo,
        encendido,
        evento,
        tiempo_parqueo
        from ras.f_get_parqueos(?,?,?) ",[$request->id_vehiculos,$request->fecha_inicio,$request->fecha_fin]);

        $arrayParametros=[
            'lista_monitoreo_tiempo_real'=>$lista_monitoreo_tiempo_real
        ]; 
        
        return response()->json($arrayParametros);
    }
    public function reporte_parqueos(Request $request){
        $lista_parqueos_vehiculos=DB::select(" select  
        placa,
        latitude,
        longitude,
        address,
        devicetime::date,
        tiempo_parqueo,
        hora_inicio,
        hora_fin,
        bateria_vehiculo
        from ras.f_reporte_parqueos(?,?,?) ",[$request->id_vehiculos,$request->fecha_inicio,$request->fecha_fin]);

        $arrayParametros=[
            'lista_parqueos_vehiculos'=>$lista_parqueos_vehiculos
        ]; 
        
        return response()->json($arrayParametros);
    }
    public function lista_geocercas (Request $request){

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" ug.id_usuario in (".$request->user()->id.")";
        }

        $query_notificacion = "select
        n.id as id_notificacion,
        case when n.type = 'geofenceExit' then 'Salio del geocerca'
        when n.type = 'geofenceEnter' then 'Entro al geocerca'
        when n.type = 'deviceOverspeed' then 'Exceso de velocidad'
        when n.type = 'maintenance' then 'Mantenimineto'
        when n.type = 'alarm' then 'Alarmas' else n.type end as notificacion
        from public.tc_notifications n ";
        
        $lista_notificacion =DB::select($query_notificacion);

        $geocerca=DB::select("select g.id,
                            g.name::varchar as nombre_geocerca,
                            g.description::varchar as descripcion,
                            g.area,
                            us.name as usuario,
                            ug.tipo_geocerca
                            from public.tc_geofences g
                            join ras.tusuario_geocerca ug on ug.id_geocerca=g.id
                            join segu.users us on us.id=ug.id_usuario
                            where ".$ids." and codigo = ?   order by g.id desc ",["geocerca"]);

        $arrayParametros=[
            'lista_geocercas'=>$geocerca,
            'lista_notificacion'=>$lista_notificacion 
        ];
        
        return response()->json($arrayParametros);
    }
    public function post_geocerca(Request $request){

        $validacion = $this->validar_geocerca($request);
        $coockies = $this->iniciar_sesion_traccar();

        
        if($request->id==0){
            if((bool)$validacion["validacion"]==true){

                $this->post_geocerca_traccar($coockies,$request->nombre_geocerca,$request->descripcion,$request->area);
                //DB::insert('insert into public.tc_geofences (name,description,area) values(?,?,?);',[$request->nombre_geocerca,$request->descripcion,$request->area]);
                $id_geocerca=DB::select('select max(g.id)::integer as id_geocerca from public.tc_geofences g');
                //DB::insert('insert into public.tc_user_geofence (userid,geofenceid) values(1,?);',[(int)$id_geocerca[0]->id_geocerca]);
                DB::insert('insert into ras.tusuario_geocerca (id_usuario,id_geocerca,tipo_geocerca,codigo) values(?,?,?,?);',[($request->user()->id),(int)$id_geocerca[0]->id_geocerca,$request->tipo_geocerca,"geocerca"]);
            
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){

                $this->put_geocerca_traccar($coockies,$request->id,$request->nombre_geocerca,$request->descripcion,$request->area);
                //DB::update('update public.tc_geofences set name =?,description=? ,area=? where id=?; ',[$request->nombre_geocerca,$request->descripcion,$request->area,$request->id]);
                DB::update('update ras.tusuario_geocerca set tipo_geocerca=?,codigo=? where id_geocerca = ?;',[$request->tipo_geocerca,"geocerca",$request->id]);
            }
            
        }

        $this->cerrar_sesion_traccar($coockies);

        $arrayParametros=[
            'mensaje'=>$validacion["mensaje"],
            'validacion'=>$validacion["validacion"]
        ]; 

        return response()->json($arrayParametros);
    }
    public function validar_geocerca($request){
        $mensaje=[];
        $validacion=true;


        $cantidad_geocerca=DB::select("select count(*) as cantidad
        from public.tc_geofences g
                 join ras.tusuario_geocerca ug on ug.id_geocerca=g.id
                 join segu.users us on us.id=ug.id_usuario
        where us.id = ? ",[(int)$request->user()->id]);

        if($request->id==0){//para nuevo geocerca
            if((int)($cantidad_geocerca[0]->cantidad) > 4){ //limite de geocerca 5 por usuario solo validamos en registros nuevos
                array_push($mensaje,'El limite de geocercas es de 5 por usuario, para incrementar el limite de geocerca contactese con el administrador ');
                $validacion=false;
            }
        }

        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];
        return $arrayParametros;
    }
    public function eliminar_geocerca($id){

        $coockies = $this->iniciar_sesion_traccar();
        $this->delete_geocerca_traccar($coockies,$id);
        $this->cerrar_sesion_traccar($coockies);
        //db::delete('delete from public.tc_geofences where id=? ',[$id]);

        $arrayParametros=[
            'mensaje'=>"ok"
        ];
        
        return $arrayParametros;
    }
    public function lista_geocercas_seleccionados (Request $request ,$id_vehiculo){

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" ug.id_usuario in (".$request->user()->id.")";
        }

        $query_notificacion = "select
        n.id as id_notificacion,
        case when n.type = 'geofenceExit' then 'Salio del geocerca'
        when n.type = 'geofenceEnter' then 'Entro al geocerca'
        when n.type = 'deviceOverspeed' then 'Exceso de velocidad'
        when n.type = 'maintenance' then 'Mantenimineto'
        when n.type = 'alarm' then 'Alarmas' else n.type end as notificacion
        from public.tc_notifications n ";

        
        $lista_notificacion =DB::select($query_notificacion);

        
        $lista_notificacion_seleccionados =DB::select("select
        n.id as id_notificacion,
        case when n.type = 'geofenceExit' then 'Salio del geocerca'
             when n.type = 'geofenceEnter' then 'Entro al geocerca'
             when n.type = 'deviceOverspeed' then 'Exceso de velocidad'
             when n.type = 'maintenance' then 'Mantenimineto'
             when n.type = 'alarm' then 'Alarmas' else n.type end as notificacion

        from public.tc_notifications n
        join public.tc_device_notification dn on dn.notificationid = n.id
        join public.tc_devices d on d.id=dn.deviceid
        join ras.tvehiculo v on v.uniqueid=d.uniqueid
        where v.id_vehiculo = ? ",[$id_vehiculo]);


        $geocerca=DB::select("select g.id,
                            g.name::varchar as nombre_geocerca,
                            g.description::varchar as descripcion,
                            g.area,
                            us.name as usuario,
                            ug.tipo_geocerca
                            from public.tc_geofences g
                            join ras.tusuario_geocerca ug on ug.id_geocerca=g.id
                            join segu.users us on us.id=ug.id_usuario
                            where ".$ids."  order by g.id desc ");

        $lista_geocercas_seleccionados=DB::select("select g.id,
                            g.name::varchar as nombre_geocerca,
                            g.description::varchar as descripcion,
                            g.area ,
                            us.name as usuario ,
                            ug.tipo_geocerca
                            from public.tc_geofences g
                            join ras.tusuario_geocerca ug on ug.id_geocerca=g.id
                            join segu.users us on us.id=ug.id_usuario
                            join public.tc_device_geofence dg on dg.geofenceid=g.id
                            join public.tc_devices d on d.id=dg.deviceid
                            join ras.tvehiculo v on v.uniqueid=d.uniqueid
                            where v.id_vehiculo = ? ",[$id_vehiculo]);

        $arrayParametros=[
            'lista_geocercas'=>$geocerca,
            'lista_geocercas_seleccionados'=>$lista_geocercas_seleccionados,
            'lista_notificacion'=>$lista_notificacion,
            'lista_notificacion_seleccionados'=>$lista_notificacion_seleccionados 
        ];
        
        return response()->json($arrayParametros);
    }
    public function post_geocercas_seleccionados (Request $request){

        $coockies = $this->iniciar_sesion_traccar();


        $longitud_geocerca = count($request->lista_geocercas_seleccionados);
        $deviceid =DB::select("
        select d.id as deviceid
        from public.tc_devices d
        join ras.tvehiculo v on v.uniqueid=d.uniqueid
        where v.id_vehiculo = ?",[(int)$request->id_vehiculo]);

        
        $lista_eliminar_geocerca=DB::select("
                                    select deviceid,geofenceid from public.tc_device_geofence where deviceid =?
                                    ",[(int)$deviceid[0]->deviceid]);

        for ($i=0; $i < count($lista_eliminar_geocerca); $i++) { 

            $this->delete_permissions_geocerca_device($coockies,(int)$lista_eliminar_geocerca[$i]->deviceid,(int)$lista_eliminar_geocerca[$i]->geofenceid); 
        }

        $lista_eliminar_notificacion=DB::select("
                                    select deviceid,notificationid from public.tc_device_notification where deviceid = ?
                                    ",[(int)$deviceid[0]->deviceid]);

        for ($i=0; $i < count($lista_eliminar_notificacion); $i++) { 

            $this->delete_permissions_notificacion_device($coockies,(int)$lista_eliminar_notificacion[$i]->deviceid,(int)$lista_eliminar_notificacion[$i]->notificationid); 
        }

        //DB::delete("delete from public.tc_device_geofence where deviceid = ? ",[(int)$deviceid[0]->deviceid]);
        for($i=0; $i<$longitud_geocerca; $i++){      
            //DB::insert('insert into public.tc_device_geofence (deviceid,geofenceid) values(?,?)',[(int)$deviceid[0]->deviceid,(int)$request->lista_geocercas_seleccionados[$i]["id"]]);
            $this->post_permissions_geocerca_device($coockies, (int)$deviceid[0]->deviceid, (int)$request->lista_geocercas_seleccionados[$i]["id"]);
        }

        $longitud_notificaciones = count($request->lista_notificaciones_seleccionados);
        //DB::delete("delete from public.tc_device_notification where deviceid = ? ",[(int)$deviceid[0]->deviceid]);
        for($i=0; $i<$longitud_notificaciones; $i++){      
            $this->post_permissions_notificacion_device($coockies, (int)$deviceid[0]->deviceid, (int)$request->lista_notificaciones_seleccionados[$i]["id_notificacion"]);
            //DB::insert('insert into public.tc_device_notification (deviceid,notificationid) values(?,?)',[(int)$deviceid[0]->deviceid,(int)$request->lista_notificaciones_seleccionados[$i]["id_notificacion"]]);
        }

        $validacion = $this->validar_geocercas_seleccionados($request);

        $this->cerrar_sesion_traccar($coockies);
        $arrayParametros=[
            'mensaje'=>$validacion["mensaje"],
            'validacion'=>$validacion["validacion"]
        ]; 

        return response()->json($arrayParametros);
    }
    public function validar_geocercas_seleccionados($request){
        $mensaje=[];
        $validacion=true;
        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];
        return $arrayParametros;
    }
    /////////////////////////////////cambio para nuevo framework////////////////////////////////////
    public function lista_servicio_cliente($id_cliente){

        $lista_servicios_cliente=db::select("select
        s.id_servicio,
        s.id_cliente,
        s.costo_total,
        
    json_build_object(
            'value', ts.id_tipo_servicio,
            'label', ts.tipo_servicio
    ) AS id_tipo_servicio,
        
        ts.tipo_servicio,
        ts.codigo
        from ras.tservicio s
        join ras.ttipo_servicio ts on ts.id_tipo_servicio=s.id_tipo_servicio
        where s.id_cliente = ? ",[$id_cliente]);



        $arrayParametros=[
            'lista_servicios_cliente'=>$lista_servicios_cliente
        ];

        return response()->json($arrayParametros);

    }
    public function lista_tipo_servicio(){

        $lista_tipo_servicio = db::select('select ts.id_tipo_servicio,ts.tipo_servicio,ts.codigo
        from ras.ttipo_servicio ts');



        $arrayParametros=[
            'lista_tipo_servicio'=>$lista_tipo_servicio,
        ];

        return response()->json($arrayParametros);

    }

    public function post_servicio(Request $request){

        $validacion = $this->validar_servicio($request);
        $id_tipo_servicio=$request->id_tipo_servicio['value'];
        if( (int)($request->id_servicio) == 0 ){


            db::insert('insert into ras.tservicio (id_cliente,id_usuario_reg,costo_total,fecha_reg,id_tipo_servicio)
            values (?::integer,?::integer,?::numeric,now()::timestamp,?::integer)'
                ,[(int)$request->id_cliente,(int)$request->user()->id,$request->costo_total,$id_tipo_servicio ]);
        }else{
            db::insert('update ras.tservicio set
            id_cliente = ?::integer,
            id_usuario_mod = ?::integer,
            costo_total = ?,
            fecha_mod = now()::timestamp,
            id_tipo_servicio = ?::integer
        where id_servicio = ?::integer '
                ,[(int)$request->id_cliente,(int)$request->user()->id,$request->costo_total,$id_tipo_servicio,$request->id_servicio ]);
        }

        $arrayParametros=[
            'mensaje'=>$validacion["mensaje"],
            'validacion'=>$validacion["validacion"]
        ];

        return response()->json($arrayParametros);
    }
    public function eliminar_servicio($id_servicio){
        db::update('delete from ras.tservicio where id_servicio = ? ',[$id_servicio]);

        $arrayParametros=[
            'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }
    public function validar_servicio($request){
        $mensaje=[];
        $validacion=true;

        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];

        return $arrayParametros;
    }


    public function lista_pagos_cliente($id_cliente){

        $servicio=DB::select("
                            with meses as (
                                select 1 as id_periodo, 'Enero' as mes
                                union all
                                select 2 as id_periodo, 'Febrero' as mes
                                union all
                                select 3 as id_periodo, 'Marzo' as mes
                                union all
                                select 4 as id_periodo, 'Abril' as mes
                                union all
                                select 5 as id_periodo, 'Mayo' as mes
                                union all
                                select 6 as id_periodo, 'Junio' as mes
                                union all
                                select 7 as id_periodo, 'Julio' as mes
                                union all
                                select 8 as id_periodo, 'Agosto' as mes
                                union all
                                select 9 as id_periodo, 'Septiembre' as mes
                                union all
                                select 10 as id_periodo, 'Octubre' as mes
                                union all
                                select 11 as id_periodo, 'Noviembre' as mes
                                union all
                                select 12 as id_periodo, 'Diciembre' as mes )
                            select
                                ps.id_pago_servicio,
                                p.nombre,
                                p.apellido_paterno,
                                p.apellido_materno,
                                p.ci,
                                p.celular,
                                ps.fecha_pago::date,
                                ps.fecha_inicio::Date,
                                ps.fecha_fin::Date,
                                ps.cantidad_vehiculos,
                                ps.cantidad_meses,
                                ps.precio_mensual,
                                ps.sub_total,
                                (case when extract(MONTH from ps.fecha_inicio)::integer = extract(MONTH from ps.fecha_fin)::integer then
                                          mi.mes::varchar
                                      else
                                          mi.mes||' - '||mf.mes
                                    end)::varchar as mes_pagado,
                                c.id_cliente,
                                ts.tipo_servicio::varchar,
                                json_build_object(
                                        'value', s.id_servicio,
                                        'label', ts.tipo_servicio
                                ) AS id_servicio
                            from ras.tcliente c
                            join ras.tservicio s on s.id_cliente=c.id_cliente
                            join ras.tpersona p on p.id_persona=c.id_persona
                            join ras.tpago_servicio ps on ps.id_servicio=s.id_servicio
                            join ras.ttipo_servicio ts on ts.id_tipo_servicio = s.id_tipo_servicio
                            left join meses mi on (mi.id_periodo)::integer = extract (MONTH from ps.fecha_inicio )::integer
                            left join meses mf on (mf.id_periodo)::integer = extract (MONTH from ps.fecha_fin )::integer

                            where c.id_cliente = ?::INTEGER 
                            order by p.nombre,p.apellido_paterno,p.apellido_materno,ps.fecha_inicio,ps.fecha_fin ",[$id_cliente]);

        $arrayParametros=[
            'lista_pagos_cliente'=>$servicio
        ];

        return response()->json($arrayParametros);
    }
    public function post_pagos_cliente(Request $request){

        $validacion = $this->validar_pago($request);

        $cantidad_servicio=db::select('select count(*) as cantidad
        from ras.tcliente c
        join ras.tservicio s on s.id_cliente = c.id_cliente
        where c.id_cliente = ?::integer ',[$request->id_cliente]);

        $id_tipo_servicio=$request->id_servicio['value'];

        if( (int)($request->id_pago_servicio) == 0 ){

            db::insert('INSERT INTO ras.tpago_servicio (precio_mensual,fecha_inicio,fecha_fin,cantidad_vehiculos,cantidad_meses,sub_total,fecha_pago,id_usuario_reg,id_servicio) 
            VALUES (?::NUMERIC,?::TIMESTAMP,?::TIMESTAMP,?::INTEGER,?::INTEGER,?::NUMERIC,?::TIMESTAMP,?,?  ) '
                ,[$request->precio_mensual,$request->fecha_inicio,$request->fecha_fin,$request->cantidad_vehiculos,$request->cantidad_meses,$request->sub_total,$request->fecha_pago,(int)$request->user()->id,$id_tipo_servicio ]);
        }else{
            db::insert('UPDATE  ras.tpago_servicio 
            SET precio_mensual = ?,
            fecha_inicio = ?::TIMESTAMP,
            fecha_fin = ?::TIMESTAMP,
            cantidad_vehiculos = ?,
            cantidad_meses = ?,
            sub_total = ?,
            fecha_pago = ?::TIMESTAMP,
            id_servicio = ? 
            where id_pago_servicio = ? '
                ,[$request->precio_mensual,$request->fecha_inicio,$request->fecha_fin,$request->cantidad_vehiculos,$request->cantidad_meses,$request->sub_total,$request->fecha_pago,(int)$request->id_servicio,$id_tipo_servicio ]);
        }

        $arrayParametros=[
            'mensaje'=>$validacion["mensaje"],
            'validacion'=>$validacion["validacion"]
        ];

        return response()->json($arrayParametros);
    }
    public function validar_pago($request){
        $mensaje=[];
        $validacion=true;

        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];

        return $arrayParametros;
    }
    public function eliminar_pagos_cliente($id_pago_servicio){
        db::update('delete from ras.tpago_servicio where id_pago_servicio = ? ',[$id_pago_servicio]);

        $arrayParametros=[
            'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }

    public function lista_pago_servicio_cliente($id_cliente){


        $lista_pago_seleccionado=db::select('select
    ts.tipo_servicio,
    s.id_servicio,
    ts.id_tipo_servicio
from ras.ttipo_servicio ts
         join  ras.tservicio s on s.id_tipo_servicio = ts.id_tipo_servicio
         join ras.tcliente c on c.id_cliente = s.id_cliente
where  c.id_cliente  = ? ',[$id_cliente]);

        $arrayParametros=[
            'lista_pago_seleccionado'=>$lista_pago_seleccionado
        ];

        return response()->json($arrayParametros);

    }

    public function post_geocercas_dispositivo(Request $request)
    {
        // Iniciar sesión en Traccar y obtener cookies
        $coockies = $this->iniciar_sesion_traccar();

        // Obtener el ID del dispositivo según el vehículo
        $deviceid = DB::select("
        select d.id as deviceid
        from public.tc_devices d
        join ras.tvehiculo v on v.uniqueid = d.uniqueid
        where v.id_vehiculo = ?", [(int)$request->id_vehiculo]);

        // Verificar que se haya encontrado el dispositivo
        if (empty($deviceid)) {
            return response()->json(['error' => 'Dispositivo no encontrado'], 404);
        }

        // Eliminar las geocercas anteriores
        $lista_eliminar_geocerca = DB::select("
        select deviceid, geofenceid from public.tc_device_geofence where deviceid = ?",
            [(int)$deviceid[0]->deviceid]);

        foreach ($lista_eliminar_geocerca as $geocerca) {
            $this->delete_permissions_geocerca_device($coockies, (int)$geocerca->deviceid, (int)$geocerca->geofenceid);
        }

        // Eliminar las notificaciones anteriores
        $lista_eliminar_notificacion = DB::select("
        select deviceid, notificationid from public.tc_device_notification where deviceid = ?",
            [(int)$deviceid[0]->deviceid]);

        foreach ($lista_eliminar_notificacion as $notificacion) {
            $this->delete_permissions_notificacion_device($coockies, (int)$notificacion->deviceid, (int)$notificacion->notificationid);
        }

        // Insertar nuevas geocercas
        foreach ($request->id_geocercas as $geocerca) {
            $this->post_permissions_geocerca_device($coockies, (int)$deviceid[0]->deviceid, (int)$geocerca['value']);
        }

        // Insertar nuevas notificaciones
        foreach ($request->id_notificaciones as $notificacion) {
            $this->post_permissions_notificacion_device($coockies, (int)$deviceid[0]->deviceid, (int)$notificacion['value']);
        }

        // Validar las geocercas del dispositivo
        $validacion = $this->validar_geocercas_dispositivo_seleccionados($request);

        // Cerrar sesión en Traccar
        $this->cerrar_sesion_traccar($coockies);

        // Retornar la respuesta JSON
        $arrayParametros = [
            'mensaje' => $validacion['mensaje'],
            'validacion' => $validacion['validacion']
        ];

        return response()->json($arrayParametros);
    }

    public function validar_geocercas_dispositivo_seleccionados($request)
    {
        $mensaje = [];
        $validacion = true;

        $arrayParametros = [
            'mensaje' => $mensaje,
            'validacion' => $validacion
        ];

        return $arrayParametros;
    }


}