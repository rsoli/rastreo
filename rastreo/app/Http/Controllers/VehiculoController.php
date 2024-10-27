<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class VehiculoController extends Controller
{
    public function lista_vehiculos($id)
    {
        $vehiculo=DB::select("select  
        v.id_vehiculo,
        v.placa,
        
        v.marca,
        v.modelo,
        v.color,
        v.cilindrada,
        
        v.uniqueid,
        v.linea_gps,
        v.modelo_gps,
        v.fecha_registro,
        v.id_cliente,
        v.id_departamento,
        d.nombre_departamento,
        ts.id_tipo_servicio,
        ts.tipo_servicio
        from ras.tvehiculo v
        join ras.tdepartamento d on d.id_departamento=v.id_departamento 
        left join ras.ttipo_servicio ts on ts.id_tipo_servicio = v.id_tipo_servicio
        where v.id_cliente = ? order by v.id_vehiculo desc ",[$id]);


        $lista_tipo_servicio=db::select('select
        ts.id_tipo_servicio,
        ts.tipo_servicio,
        ts.codigo,
        s.id_servicio
        from ras.ttipo_servicio ts
        join  ras.tservicio s on s.id_tipo_servicio = ts.id_tipo_servicio
        where  s.id_cliente = ?::INTEGER ',[$id]);

        $arrayParametros=[
            'vehiculo'=>$vehiculo,
            'lista_tipo_servicio'=>$lista_tipo_servicio
        ];
        
        return response()->json($arrayParametros);

    }
    public function get_vehiculo($id)
    {

        $vehiculo=DB::select("select  
        v.id_vehiculo,
        v.placa,
        
        v.marca,
        v.modelo,
        v.color,
        v.cilindrada,
        
        v.uniqueid,
        v.linea_gps,
        v.modelo_gps,
        v.fecha_registro,
        v.id_cliente,
        v.id_departamento,
        d.nombre_departamento,
        ts.id_tipo_servicio,
        ts.tipo_servicio
        from ras.tvehiculo v
        join ras.tdepartamento d on d.id_departamento=v.id_departamento
        left join ras.ttipo_servicio ts on ts.id_tipo_servicio = v.id_tipo_servicio
        where v.id_vehiculo = ? ",[$id]);
                    
        
        $departamentos=DB::select("select 
                    d.id_departamento,
                    d.nombre_departamento
                    from ras.tdepartamento d ");

        $id_departamento = 0;
        $id_tipo_servicio = 0;
        $id_cliente = 0;
        if($id!=0){
            $id_departamento = $vehiculo[0]->id_departamento;
            $id_tipo_servicio = $vehiculo[0]->id_tipo_servicio;
            $id_cliente = $vehiculo[0]->id_cliente;
        }else{

        }
        $departamento_seleccionado=DB::select("select 
                    d.id_departamento,
                    d.nombre_departamento
                    from ras.tdepartamento d
                    where d.id_departamento = ? ",[$id_departamento]);

        $lista_tipo_servicio_seleccionado=db::select('select
                    ts.id_tipo_servicio,
                    ts.tipo_servicio,
                    ts.codigo,
                    s.id_servicio
                from ras.ttipo_servicio ts
                join  ras.tservicio s on s.id_tipo_servicio = ts.id_tipo_servicio
                join ras.tvehiculo v on v.id_cliente=s.id_cliente
                where  ts.id_tipo_servicio = ? and v.id_vehiculo = ?  ',[$id_tipo_servicio,$id ]);

        $lista_tipo_servicio=db::select('select
                ts.id_tipo_servicio,
                ts.tipo_servicio,
                ts.codigo,
                s.id_servicio
                from ras.ttipo_servicio ts
                join  ras.tservicio s on s.id_tipo_servicio = ts.id_tipo_servicio
                where  s.id_cliente = ?::INTEGER ',[$id_cliente]);
        //return $json;
        $arrayParametros=[
            'vehiculo'=>$vehiculo,
            'departamentos'=>$departamentos,
            'departamento_seleccionado'=>$departamento_seleccionado,
            'lista_tipo_servicio_seleccionado'=>$lista_tipo_servicio_seleccionado,
            'lista_tipo_servicio'=>$lista_tipo_servicio 
        ];
        
        return response()->json($arrayParametros);
    }

    public function post_vehiculo(Request $request){
        $validacion = $this->validar_vehiculo($request);
        $coockies = $this->iniciar_sesion_traccar();

        if($request->id_vehiculo==0){
            if((bool)$validacion["validacion"]==true){
                DB::insert('insert into ras.tvehiculo(placa,uniqueid,linea_gps,modelo_gps,
                fecha_registro,id_cliente,id_departamento,marca,modelo,color,cilindrada,id_tipo_servicio)
                values(?,?,?,?,now()::timestamp,?,?,?,?,?,?,?)
                ',[$request->placa,$request->uniqueid,$request->linea_gps,$request->modelo_gps,(int)$request->id_cliente,(int)$request->id_departamento,$request->marca,$request->modelo,$request->color,$request->cilindrada,(int)$request->id_tipo_servicio]);
                $this->post_device_traccar($coockies,$request->placa,$request->uniqueid);
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){

                $uniqueid=DB::select('select v.uniqueid from ras.tvehiculo v where v.id_vehiculo = ? ',[(int)$request->id_vehiculo]);
                $id_geocerca = DB::select('select id from public.tc_devices where uniqueid=? ',[$uniqueid[0]->uniqueid]);
                $this->put_device_traccar($coockies,(int)$id_geocerca[0]->id,$request->placa,$request->uniqueid);

                DB::update('update ras.tvehiculo 
                set placa=?,
                uniqueid=?,
                linea_gps=?,
                modelo_gps= ?,
                fecha_registro= now()::timestamp,
                id_cliente= ?,
                id_departamento= ?,
                marca = ?, 
                modelo = ?,
                color = ?,
                cilindrada = ?,
                id_tipo_servicio = ?
                where id_vehiculo=?',
                [$request->placa,$request->uniqueid,$request->linea_gps,$request->modelo_gps,(int)$request->id_cliente,(int)$request->id_departamento,$request->marca,$request->modelo,$request->color,$request->cilindrada,(int)$request->id_tipo_servicio,(int)$request->id_vehiculo]);

            }
        }

        $this->cerrar_sesion_traccar($coockies);

        $arrayParametros=[
        'mensaje'=>$validacion["mensaje"],
        'validacion'=>$validacion["validacion"]
        ];

        return response()->json($arrayParametros);  
    }
    public function validar_vehiculo($request){
        $mensaje=[];
        $validacion=true;

        if($request->id_vehiculo!=0){

            $duplicado_placa=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tvehiculo v where v.placa = ? and v.id_vehiculo != ? ',[$request->id_persona,$request->id_vehiculo]);
            if((int)($duplicado_placa[0]->cantidad)>0){
                array_push($mensaje,'El campo placa ya esta registrado');
                $validacion=false;
            }

            $duplicado_imei=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tvehiculo v where v.uniqueid = ? and v.id_vehiculo != ? ',[$request->uniqueid,$request->id_vehiculo]);
            if((int)($duplicado_imei[0]->cantidad)>0){
                array_push($mensaje,'El campo Imei ya esta registrado');
                $validacion=false;
            }
           
        }
        else{

            $duplicado_placa=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tvehiculo v where v.placa = ?  ',[$request->id_persona]);

            if((int)($duplicado_placa[0]->cantidad)>0){
                array_push($mensaje,'El campo placa ya esta registrado');
                $validacion=false;
            }
            $duplicado_imei=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tvehiculo v where v.uniqueid = ?  ',[$request->uniqueid]);

            if((int)($duplicado_imei[0]->cantidad)>0){
                array_push($mensaje,'El campo Imei ya esta registrado');
                $validacion=false;
            }

        }


        $arrayParametros=[
        'mensaje'=>$mensaje,
        'validacion'=>$validacion
        ];

        return $arrayParametros;
    }
    public function eliminar_vehiculo($id){

        $coockies = $this->iniciar_sesion_traccar();

        $uniqueid=DB::select('select v.uniqueid from ras.tvehiculo v where v.id_vehiculo = ? ',[$id]);

        $id_geocerca = DB::select('select id from public.tc_devices where uniqueid=? ',[$uniqueid[0]->uniqueid]);
        $this->delete_device_traccar($coockies,(int)$id_geocerca[0]->id );

        db::update('delete from ras.tvehiculo  where id_vehiculo = ? ',[$id]);

        $this->cerrar_sesion_traccar($coockies);

        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }
    public function lista_vehiculos_usuario(Request $request)
    {

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" us.id in (".$request->user()->id.")";
        }

        //lista de vehiculos con usuarios compartidos
        $vehiculo=DB::select("select
                                            v.id_vehiculo,
                                            v.placa,
                                            v.marca,
                                            v.modelo,
                                            v.color,
                                            v.cilindrada,
                                            v.uniqueid,
                                            v.linea_gps,
                                            v.modelo_gps,
                                            v.fecha_registro,
                                            v.id_cliente,
                                            v.id_departamento,
                                            d.nombre_departamento,
                                            us.name as nombre_usuario,
                                            p.nombre as nombre_persona,
                                            p.apellido_paterno,
                                            p.apellido_materno,
                                            ts.id_tipo_servicio,
                                            ts.tipo_servicio,
                                            ts.codigo,
                                            dg.activar_motor,
                                            dg.desactivar_motor
                                            from ras.tvehiculo v
                                            join ras.tdepartamento d on d.id_departamento=v.id_departamento
                                            join ras.tcliente c on c.id_cliente=v.id_cliente -- or c.id_cliente=v.id_cliente_compartir
                                            join ras.tpersona p on p.id_persona=c.id_persona
                                            join segu.users us on us.id_persona=p.id_persona
                                            left join ras.ttipo_servicio ts on ts.id_tipo_servicio = v.id_tipo_servicio
                                            left join ras.tdispositivo_gps dg on dg.id_dispositivo_gps = v.id_dispositivo_gps
                                            where ".$ids." and us.estado=?
                                            order by p.nombre,p.apellido_paterno,p.apellido_materno asc
                                            ",["activo"]);

        // $vehiculo=DB::select("select
        //                         v.id_vehiculo,
        //                         v.placa,
        //                         v.marca,
        //                         v.modelo,
        //                         v.color,
        //                         v.cilindrada,
        //                         v.uniqueid,
        //                         v.linea_gps,
        //                         v.modelo_gps,
        //                         v.fecha_registro,
        //                         v.id_cliente,
        //                         v.id_departamento,
        //                         d.nombre_departamento,
        //                         us.name as nombre_usuario,
        //                         p.nombre nombre_persona,
        //                         p.apellido_paterno,
        //                         p.apellido_materno,
        //                         ts.id_tipo_servicio,
        //                         ts.tipo_servicio,
        //                         ts.codigo,
        //                         dg.activar_motor,
        //                         dg.desactivar_motor
        //                         from ras.tvehiculo v
        //                         join ras.tdepartamento d on d.id_departamento=v.id_departamento
        //                         join ras.tcliente c on c.id_cliente=v.id_cliente
        //                         join ras.tpersona p on p.id_persona=c.id_persona
        //                         join segu.users us on us.id_persona=p.id_persona
        //                         left join ras.ttipo_servicio ts on ts.id_tipo_servicio = v.id_tipo_servicio
        //                         left join ras.tdispositivo_gps dg on dg.id_dispositivo_gps = v.id_dispositivo_gps
        //                         where ".$ids." and us.estado=?
        //                         order by p.nombre,p.apellido_paterno,p.apellido_materno asc ",["activo"]);

        $arrayParametros=[
            'vehiculo'=>$vehiculo
        ];

        return response()->json($arrayParametros);

    }
    public function inicio_traccar(Request $request){

        $coockies = $this->iniciar_sesion_traccar();

        $arrayParametros=[
            'cookie'=>$coockies
        ];

        return response()->json($arrayParametros);

    }

    /////nuevo formato de sistema ////////////////////////////////////////////////
    public function lista_cliente_vehiculos($id)
    {
        $vehiculo=DB::select("select
    v.id_vehiculo,
    v.placa,

    v.marca,
    v.modelo,
    v.color,
    v.cilindrada,

    v.uniqueid,
    v.linea_gps,
    v.modelo_gps,
    v.fecha_registro,
    v.id_cliente,
    v.id_departamento,
    json_build_object(
            'value', d.id_departamento,
            'label', d.nombre_departamento
    ) AS id_departamento,
    d.nombre_departamento,
    json_build_object(
            'value', ts.id_tipo_servicio,
            'label', ts.tipo_servicio
    ) AS id_tipo_servicio,
    ts.tipo_servicio
from ras.tvehiculo v
         join ras.tdepartamento d on d.id_departamento=v.id_departamento
         left join ras.ttipo_servicio ts on ts.id_tipo_servicio = v.id_tipo_servicio
            
        where v.id_cliente = ? order by v.id_vehiculo desc ",[$id]);




        $arrayParametros=[
            'lista_cliente_vehiculos'=>$vehiculo
        ];

        return response()->json($arrayParametros);

    }

    public function post_cliente_vehiculo(Request $request){
        $validacion = $this->validar_vehiculo($request);
        $coockies = $this->iniciar_sesion_traccar();
        $id_departamento=(int)$request->id_departamento['value'];
        $id_tipo_servicio=(int)$request->id_tipo_servicio['value'];


        if($request->id_vehiculo==0){
            if((bool)$validacion["validacion"]==true){
                DB::insert('insert into ras.tvehiculo(placa,uniqueid,linea_gps,modelo_gps,
                fecha_registro,id_cliente,id_departamento,marca,modelo,color,cilindrada,id_tipo_servicio)
                values(?,?,?,?,now()::timestamp,?,?,?,?,?,?,?)
                ',[$request->placa,$request->uniqueid,$request->linea_gps,$request->modelo_gps,(int)$request->id_cliente,$id_departamento,$request->marca,$request->modelo,$request->color,$request->cilindrada,$id_tipo_servicio]);
                $this->post_device_traccar($coockies,$request->placa,$request->uniqueid);
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){

                $uniqueid=DB::select('select v.uniqueid from ras.tvehiculo v where v.id_vehiculo = ? ',[(int)$request->id_vehiculo]);
                $id_geocerca = DB::select('select id from public.tc_devices where uniqueid=? ',[$uniqueid[0]->uniqueid]);
                $this->put_device_traccar($coockies,(int)$id_geocerca[0]->id,$request->placa,$request->uniqueid);

                DB::update('update ras.tvehiculo 
                set placa=?,
                uniqueid=?,
                linea_gps=?,
                modelo_gps= ?,
                fecha_registro= now()::timestamp,
                id_cliente= ?,
                id_departamento= ?,
                marca = ?, 
                modelo = ?,
                color = ?,
                cilindrada = ?,
                id_tipo_servicio = ?
                where id_vehiculo=?',
                    [$request->placa,$request->uniqueid,$request->linea_gps,$request->modelo_gps,(int)$request->id_cliente,$id_departamento,$request->marca,$request->modelo,$request->color,$request->cilindrada,$id_tipo_servicio,(int)$request->id_vehiculo]);

            }
        }

        $this->cerrar_sesion_traccar($coockies);

        $arrayParametros=[
            'mensaje'=>$validacion["mensaje"],
            'validacion'=>$validacion["validacion"]
        ];

        return response()->json($arrayParametros);
    }

    public function lista_dispositivos(Request $request)
    {
        // Verificar si el usuario está autenticado
        if (!$request->user()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Determinar si el usuario es admin o no
        $ids = $this->es_admin($request->user()->id)
            ? "0=0"
            : "us.id = " . $request->user()->id;

        // Consulta SQL
        $lista_dispositivos = DB::select("
WITH geocerca AS (
    SELECT
        g.name,
        g.id,
        v.id_vehiculo
    FROM public.tc_geofences g
             JOIN ras.tusuario_geocerca ug ON ug.id_geocerca = g.id
             JOIN segu.users us ON us.id = ug.id_usuario
             JOIN public.tc_device_geofence dg ON dg.geofenceid = g.id
             JOIN public.tc_devices d ON d.id = dg.deviceid
             JOIN ras.tvehiculo v ON v.uniqueid = d.uniqueid
    WHERE us.estado = 'activo' 
),
     notificaciones AS (
         SELECT
             n.id,
             v.id_vehiculo,
             CASE
                 WHEN n.type = 'geofenceExit' THEN 'Salio del geocerca'
                 WHEN n.type = 'geofenceEnter' THEN 'Entro al geocerca'
                 WHEN n.type = 'deviceOverspeed' THEN 'Exceso de velocidad'
                 WHEN n.type = 'maintenance' THEN 'Mantenimiento'
                 WHEN n.type = 'alarm' THEN 'Alarma'
                 ELSE n.type
                 END AS notificacion
         FROM public.tc_notifications n
                  JOIN public.tc_device_notification dn ON dn.notificationid = n.id
                  JOIN public.tc_devices d ON d.id = dn.deviceid
                  JOIN ras.tvehiculo v ON v.uniqueid = d.uniqueid
     )
SELECT
    v.id_vehiculo,
    v.placa,
    v.marca,
    v.modelo,
    v.color,
    v.cilindrada,
    v.uniqueid,
    v.linea_gps,
    v.modelo_gps,
    v.fecha_registro,
    v.id_cliente,
    v.id_departamento,
    d.nombre_departamento,
    us.name AS nombre_usuario,
    p.nombre AS nombre_persona,
    p.apellido_paterno,
    p.apellido_materno,
    ts.id_tipo_servicio,
    ts.tipo_servicio,
    ts.codigo,
    dg.activar_motor,
    dg.desactivar_motor,
    jsonb_pretty(
            (
                SELECT jsonb_agg(json_build_object('value', g.id, 'label', g.name))
                FROM geocerca g WHERE g.id_vehiculo = v.id_vehiculo
            )
    ) AS id_geocercas,
    (
        SELECT string_agg(g.name, ', ')
        FROM geocerca g WHERE g.id_vehiculo = v.id_vehiculo
    ) AS geocercas,
    jsonb_pretty(
            (
                SELECT jsonb_agg(json_build_object('value', noti.id, 'label', noti.notificacion))
                FROM notificaciones noti WHERE noti.id_vehiculo = v.id_vehiculo
            )
    ) AS id_notificaciones,
    (
        SELECT string_agg(noti.notificacion, ', ')
        FROM notificaciones noti WHERE noti.id_vehiculo = v.id_vehiculo
    ) AS notificaciones,
    dev.id as id_dispositivo,
    (case when (pos.attributes::json->'out1')::varchar = 'true' then 'Desactivado' else 'Activado' end)::varchar as motor
FROM ras.tvehiculo v
         JOIN public.tc_devices dev ON dev.uniqueid = v.uniqueid
         join public.tc_positions pos on pos.id = dev.positionid
         JOIN ras.tdepartamento d ON d.id_departamento = v.id_departamento
         JOIN ras.tcliente c ON c.id_cliente = v.id_cliente
         JOIN ras.tpersona p ON p.id_persona = c.id_persona
         JOIN segu.users us ON us.id_persona = p.id_persona
         LEFT JOIN ras.ttipo_servicio ts ON ts.id_tipo_servicio = v.id_tipo_servicio
         LEFT JOIN ras.tdispositivo_gps dg ON dg.id_dispositivo_gps = v.id_dispositivo_gps
        WHERE $ids AND us.estado = ?
    GROUP BY v.id_vehiculo, v.placa, v.marca, v.modelo, v.color, v.cilindrada, v.uniqueid,
         v.linea_gps, v.modelo_gps, v.fecha_registro, v.id_cliente, v.id_departamento,
         d.nombre_departamento, us.name, p.nombre, p.apellido_paterno, p.apellido_materno,
         ts.id_tipo_servicio, ts.tipo_servicio, ts.codigo, dg.activar_motor, dg.desactivar_motor
         ,dev.id,pos.attributes
ORDER BY p.nombre, p.apellido_paterno, p.apellido_materno ASC
    ", ['activo']);

        $arrayParametros = [
            'lista_dispositivos' => $lista_dispositivos
        ];

        return response()->json($arrayParametros);
    }
    public function post_enviarComando(Request $request)
    {


        // Inserción en la base de datos
        DB::insert('INSERT INTO ras.thistorial_comando (device_id, command, id_usuario, sent_at) VALUES (?, ?, ?, now()::timestamp)', [
            $request->device_id,
            $request->command,
            $request->user()->id
        ]);

        // Preparar el mensaje de respuesta
        $arrayParametros = [
            'mensaje' => [],
            'validacion' => true
        ];


        // Retornar la respuesta en formato JSON
        return response()->json($arrayParametros);
    }
}