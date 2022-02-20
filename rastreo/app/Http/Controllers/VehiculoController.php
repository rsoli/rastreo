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
        v.uniqueid,
        v.linea_gps,
        v.modelo_gps,
        v.fecha_registro,
        v.id_cliente,
        v.id_departamento,
        d.nombre_departamento
        from ras.tvehiculo v
        join ras.tdepartamento d on d.id_departamento=v.id_departamento 
        where v.id_cliente = ? ",[$id]);

        $arrayParametros=[
            'vehiculo'=>$vehiculo
        ];
        
        return response()->json($arrayParametros);

    }
    public function get_vehiculo($id)
    {

        $vehiculo=DB::select("select  
        v.id_vehiculo,
        v.placa,
        v.uniqueid,
        v.linea_gps,
        v.modelo_gps,
        v.fecha_registro,
        v.id_cliente,
        v.id_departamento,
        d.nombre_departamento
        from ras.tvehiculo v
        join ras.tdepartamento d on d.id_departamento=v.id_departamento
        where v.id_vehiculo = ? ",[$id]);
                    
        
        $departamentos=DB::select("select 
                    d.id_departamento,
                    d.nombre_departamento
                    from ras.tdepartamento d ");

        $id_departamento = 0;
        if($id!=0){
            $id_departamento = $vehiculo[0]->id_departamento;
        }
        $departamento_seleccionado=DB::select("select 
                    d.id_departamento,
                    d.nombre_departamento
                    from ras.tdepartamento d
                    where d.id_departamento = ? ",[$id_departamento]);

        //return $json;
        $arrayParametros=[
            'vehiculo'=>$vehiculo,
            'departamentos'=>$departamentos,
            'departamento_seleccionado'=>$departamento_seleccionado
        ];
        
        return response()->json($arrayParametros);
    }

    public function post_vehiculo(Request $request){
        $validacion = $this->validar_vehiculo($request);

        if($request->id_vehiculo==0){
            if((bool)$validacion["validacion"]==true){
                DB::insert('insert into ras.tvehiculo(placa,uniqueid,linea_gps,modelo_gps,
                fecha_registro,id_cliente,id_departamento)
                values(?,?,?,?,now()::timestamp,?,?)
                ',[$request->placa,$request->uniqueid,$request->linea_gps,$request->modelo_gps,(int)$request->id_cliente,(int)$request->id_departamento]);
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){
                DB::update('update ras.tvehiculo 
                set placa=?,
                uniqueid=?,
                linea_gps=?,
                modelo_gps= ?,
                fecha_registro= now()::timestamp,
                id_cliente= ?,
                id_departamento= ?
                where id_vehiculo=?',
                [$request->placa,$request->uniqueid,$request->linea_gps,$request->modelo_gps,(int)$request->id_cliente,(int)$request->id_departamento,(int)$request->id_vehiculo]);
                
            }
        }

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
        db::update('delete from ras.tvehiculo  where id_vehiculo = ? ',[$id]);

        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }

}