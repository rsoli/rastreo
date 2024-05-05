<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class ChoferController extends Controller
{

    public function lista_chofer(Request $request)
    {

        if($this->es_admin($request->user()->id)==true){
            $ids=" 0=0 ";
        }else{
            $ids=" us.id in (".$request->user()->id.")";
        }

        $lista_chofer=DB::select("
        select
        c.id_chofer,
        c.nombre,
        c.apellido_paterno,
        c.apellido_materno,
        c.numero_licencia,
        c.categoria_licencia,
        c.id_cliente,
        p.nombre as nombre_persona,
        p.apellido_paterno as apellido_paterno_persona,
        p.apellido_materno as apellido_materno_persona
      from ras.tchofer c
      join ras.tcliente cli on cli.id_cliente = c.id_cliente
      join ras.tpersona p on p.id_persona = cli.id_persona
      join segu.users us on us.id_persona = p.id_persona
      where ".$ids." 
      order by c.id_chofer desc ");
                        
                            
        $arrayParametros=[
            'lista_chofer'=>$lista_chofer
        ];

        return response()->json($arrayParametros);
    }
    public function post_chofer(Request $request){
      
        $validacion = $this->validar_chofer($request);
        if($request->id_chofer==0){
          if((bool)$validacion["validacion"]==true){

            $id_cliente=DB::select('select c.id_cliente from ras.tcliente c
            join ras.tpersona p on p.id_persona = c.id_persona
            join segu.users us on us.id_persona = p.id_persona
            where us.id = ?; ',[$request->user()->id]);

            DB::insert('insert into ras.tchofer (nombre,apellido_paterno,apellido_materno,numero_licencia,categoria_licencia,id_cliente)
            values (?,?,?,?,?,?);',[$request->nombre,$request->apellido_paterno,$request->apellido_materno,$request->numero_licencia,$request->categoria_licencia,$id_cliente[0]->id_cliente ]);
          }
        }
        else{
          if((bool)$validacion["validacion"]==true){
            DB::update('update ras.tchofer set nombre=?,apellido_paterno=?,apellido_materno=?,numero_licencia=?,categoria_licencia=?,id_cliente=?
            where id_chofer = ?;',[$request->nombre,$request->apellido_paterno,$request->apellido_materno,$request->numero_licencia,$request->categoria_licencia,$request->id_cliente,$request->id_chofer]);
          }
        } 
  
        $arrayParametros=[
          'mensaje'=>$validacion["mensaje"],
          'validacion'=>$validacion["validacion"],
        ];
  
        return response()->json($arrayParametros);
    }
    public function validar_chofer($request){
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
    public function eliminar_chofer($id){

        db::update('delete from ras.tchofer where id_chofer = ?; ',[$id]);
    
        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }
    

}