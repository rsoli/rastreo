<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class EntregaController extends Controller
{

    public function lista_entrega(Request $request)
    {

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" us.id in (".$request->user()->id.")";
        }

        $id_cliente=DB::select('select c.id_cliente from ras.tcliente c
        join ras.tpersona p on p.id_persona = c.id_persona
        join segu.users us on us.id_persona = p.id_persona
        where us.id = ?; ',[$request->user()->id]);

        $lista_entrega=DB::select("
        select 
        e.id_entrega,e.origen_entrega,e.id_usuario_geocerca_destino,g.name as nombre_geocerca,g.description as descripcion_geocerca,e.fecha_ini,e.fecha_fin,e.id_vehiculo,e.detalle_entrega,e.estado_entrega,ch.id_chofer,v.placa,ch.nombre as nombre_chofer

        from ras.tentrega e
        join ras.tusuario_geocerca ug on ug.id_usuario_geocerca = e.id_usuario_geocerca_destino
        join public.tc_geofences g on g.id = ug.id_geocerca
        join ras.tvehiculo v on v.id_vehiculo=e.id_vehiculo
        join ras.tchofer ch on ch.id_chofer=e.id_chofer

        where e.id_cliente = ?
        order by e.id_entrega desc
         ",[$id_cliente[0]->id_cliente]);
                        
                            
        $arrayParametros=[
            'lista_entrega'=>$lista_entrega
        ];

        return response()->json($arrayParametros);
    }
    public function post_entrega(Request $request){
      
        $validacion = $this->validar_entrega($request);


        if($request->id_chofer==0){
          if((bool)$validacion["validacion"]==true){

            $id_cliente=DB::select('select c.id_cliente from ras.tcliente c
            join ras.tpersona p on p.id_persona = c.id_persona
            join segu.users us on us.id_persona = p.id_persona
            where us.id = ?; ',[$request->user()->id]);

            DB::insert('insert into ras.tentrega (origen_entrega,id_usuario_geocerca_destino,fecha_ini,fecha_fin,id_vehiculo,detalle_entrega,id_cliente,estado_entrega)
            values (?,?,?,?,?,?,?,?);',[$request->origen_entrega,$request->id_usuario_geocerca_destino,$request->fecha_ini,$request->fecha_fin,$request->id_vehiculo,$request->detalle_entrega,$id_cliente[0]->id_cliente,"pendiente" ]);
          }
        }
        else{
          if((bool)$validacion["validacion"]==true){

            $id_cliente=DB::select('select c.id_cliente from ras.tcliente c
            join ras.tpersona p on p.id_persona = c.id_persona
            join segu.users us on us.id_persona = p.id_persona
            where us.id = ?; ',[$request->user()->id]);

            DB::update('update ras.tentrega set origen_entrega = ?, id_usuario_geocerca_destino = ?, fecha_ini = ?, fecha_fin = ?, id_vehiculo = ?, detalle_entrega = ?,id_cliente = ?  
            where id_entrega = ?;',
            [$request->origen_entrega,$request->id_usuario_geocerca_destino,$request->fecha_ini,$request->fecha_fin,$request->id_vehiculo,$request->detalle_entrega,$id_cliente[0]->id_cliente,$request->id_entrega]);
          }
        } 
  
        $arrayParametros=[
          'mensaje'=>$validacion["mensaje"],
          'validacion'=>$validacion["validacion"],
        ];
  
        return response()->json($arrayParametros);
    }
    public function validar_entrega($request){
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
    public function eliminar_entrega($id){

        db::update('delete from ras.tentrega where id_entrega = ?; ',[$id]);
    
        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }
    

}