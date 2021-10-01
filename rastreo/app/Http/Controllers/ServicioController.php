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

    

}