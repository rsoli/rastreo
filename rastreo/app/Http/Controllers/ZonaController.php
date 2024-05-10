<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class ZonaController extends Controller
{

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
                            where ".$ids." and codigo = ?   order by g.id desc ",["zonas"]);

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
                DB::insert('insert into ras.tusuario_geocerca (id_usuario,id_geocerca,tipo_geocerca,codigo) values(?,?,?,?);',[($request->user()->id),(int)$id_geocerca[0]->id_geocerca,$request->tipo_geocerca,"zonas"]);
            
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){

                $this->put_geocerca_traccar($coockies,$request->id,$request->nombre_geocerca,$request->descripcion,$request->area);
                //DB::update('update public.tc_geofences set name =?,description=? ,area=? where id=?; ',[$request->nombre_geocerca,$request->descripcion,$request->area,$request->id]);
                DB::update('update ras.tusuario_geocerca set tipo_geocerca=?,codigo=? where id_geocerca = ?;',[$request->tipo_geocerca,"zonas",$request->id]);
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


    public function lista_zona_grupo(Request $request)
    {

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" us.id in (".$request->user()->id.")";
        }

        $lista_zona_grupo=DB::select("
        select 
        z.id_zona_grupo,z.nombre_grupo
        from logis.tzona_grupo z
        join segu.users us on us.id=z.id_usuario
      where ".$ids." 
      order by z.id_zona_grupo desc ");
                        
                            
        $arrayParametros=[
            'lista_zona_grupo'=>$lista_zona_grupo
        ];

        return response()->json($arrayParametros);
    }
    public function post_zona_grupo(Request $request){
      
        $validacion = $this->validar_zona_grupo($request);


        if($request->id_zona_grupo==0){
          if((bool)$validacion["validacion"]==true){

            DB::insert('insert into logis.tzona_grupo (nombre_grupo,id_usuario) values (?,?);',[$request->nombre_grupo,$request->user()->id ]);
          }
        }
        else{
          if((bool)$validacion["validacion"]==true){

            DB::update('update logis.tzona_grupo set nombre_grupo = ? where id_zona_grupo = ?;',[$request->nombre_grupo,$request->id_zona_grupo]);
          }
        } 
  
        $arrayParametros=[
          'mensaje'=>$validacion["mensaje"],
          'validacion'=>$validacion["validacion"],
        ];
  
        return response()->json($arrayParametros);
    }
    public function validar_zona_grupo($request){
        $mensaje=[];
        $validacion=true;

        /*if($request->id_persona!=0){
            $duplicado_persona=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from ras.tpersona p 
                                      where  trim(upper(p.ci))=trim(upper(?)) and p.id_persona != ? and p.estado=? ',[$request->ci,$request->id_persona,"activo"]);
            if((int)($duplicado_persona[0]->cantidad)>0){
                array_push($mensaje,'El campo cedula de identidad ya esta registrado');
                $validacion=false;
            }
           
        }
        else{
            $duplicado_persona=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from ras.tpersona p
                                      where  trim(upper(p.ci))=trim(upper(?)) and p.estado=? ',[$request->ci,"activo"]);
            if((int)($duplicado_persona[0]->cantidad)>0){
                array_push($mensaje,'El campo cedula de identidad ya esta registrado');
                $validacion=false;
            }
        }

        */

        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];
        
        return $arrayParametros;
    }
    public function eliminar_zona_grupo($id){

        db::update('delete from logis.tzona_grupo where id_zona_grupo  = ?; ',[$id]);
    
        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }

    public function lista_zona_grupo_detalle($id)
    {

        $lista_zona_grupo_detalle=DB::select("
        select 
        zd.id_zona_grupo_detalle,
        ug.id_geocerca,
        g.name as zona,
        g.description as descripcion,
        us.name as nombre_usuario,
        zd.id_zona_grupo,
        ug.id_usuario_geocerca
        from logis.tzona_grupo_detalle zd
        join logis.tzona_grupo z on z.id_zona_grupo = zd.id_zona_grupo
        join ras.tusuario_geocerca ug on ug.id_usuario_geocerca = zd.id_usuario_geocerca 
        join public.tc_geofences g on g.id = ug.id_geocerca
        join segu.users us on us.id=ug.id_usuario
    
      where zd.id_zona_grupo = ?
      order by zd.id_zona_grupo_detalle desc ",[$id]);




        $arrayParametros=[
            'lista_zona_grupo_detalle'=>$lista_zona_grupo_detalle
        ];

        return response()->json($arrayParametros);
    }
    public function get_zona(Request $request,$id){

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" ug.id_usuario in (".$request->user()->id.")";
        }

        $lista_zonas=DB::select("select g.id,
                            g.name::varchar as nombre_geocerca,
                            g.description::varchar as descripcion,
                            g.area,
                            us.name as usuario,
                            ug.tipo_geocerca,
                            ug.id_usuario_geocerca
                            from public.tc_geofences g
                            join ras.tusuario_geocerca ug on ug.id_geocerca=g.id
                            join segu.users us on us.id=ug.id_usuario
                            where ".$ids." and codigo = ?   order by g.id desc ",["zonas"]);


        $lista_zonas_seleecionado=DB::select("
                                            select 
                                            zd.id_zona_grupo_detalle,
                                            ug.id_geocerca,
                                            g.name as zona,
                                            g.description as descripcion,
                                            us.name as nombre_usuario,
                                            zd.id_zona_grupo,
                                            ug.id_usuario_geocerca
                                            from logis.tzona_grupo_detalle zd
                                            join logis.tzona_grupo z on z.id_zona_grupo = zd.id_zona_grupo
                                            join ras.tusuario_geocerca ug on ug.id_usuario_geocerca = zd.id_usuario_geocerca 
                                            join public.tc_geofences g on g.id = ug.id_geocerca
                                            join segu.users us on us.id=ug.id_usuario

                                        
                                            where zd.id_zona_grupo_detalle  = ?  
                                            order by zd.id_zona_grupo_detalle desc ",[$request->id_zona_grupo_detalle]);

            
        $arrayParametros=[
            'lista_zonas'=>$lista_zonas,
            'lista_zonas_seleecionado'=>$lista_zonas_seleecionado 
        ];
        
        return response()->json($arrayParametros);
    }
    public function post_zona_grupo_detalle(Request $request){
      
        $validacion = $this->validar_zona_grupo_detalle($request);


        if($request->id_zona_grupo_detalle==0){
          if((bool)$validacion["validacion"]==true){

            DB::insert('insert into logis.tzona_grupo_detalle (id_usuario_geocerca,id_zona_grupo)values(?,?);',[$request->id_usuario_geocerca,$request->id_zona_grupo ]);
          }
        }
        else{
          if((bool)$validacion["validacion"]==true){

            DB::update('update logis.tzona_grupo_detalle set id_usuario_geocerca=? where id_zona_grupo_detalle = ?;',[$request->id_usuario_geocerca,$request->id_zona_grupo_detalle]);
          }
        } 
  
        $arrayParametros=[
          'mensaje'=>$validacion["mensaje"],
          'validacion'=>$validacion["validacion"],
        ];
  
        return response()->json($arrayParametros);
    }
    public function validar_zona_grupo_detalle($request){
        $mensaje=[];
        $validacion=true;

        /*if($request->id_persona!=0){
            $duplicado_persona=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from ras.tpersona p 
                                      where  trim(upper(p.ci))=trim(upper(?)) and p.id_persona != ? and p.estado=? ',[$request->ci,$request->id_persona,"activo"]);
            if((int)($duplicado_persona[0]->cantidad)>0){
                array_push($mensaje,'El campo cedula de identidad ya esta registrado');
                $validacion=false;
            }
           
        }
        else{
            $duplicado_persona=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from ras.tpersona p
                                      where  trim(upper(p.ci))=trim(upper(?)) and p.estado=? ',[$request->ci,"activo"]);
            if((int)($duplicado_persona[0]->cantidad)>0){
                array_push($mensaje,'El campo cedula de identidad ya esta registrado');
                $validacion=false;
            }
        }

        */

        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];
        
        return $arrayParametros;
    }
    public function eliminar_zona_grupo_detalle($id){

        db::update('delete from logis.tzona_grupo_detalle where id_zona_grupo_detalle = ? ',[$id]);
    
        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }

}