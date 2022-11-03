<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class ClienteController extends Controller
{
    public function lista_cliente(Request $request)
    {
        $cliente=DB::select("select  
        c.id_cliente,
        c.id_persona,
        c.id_usuario_reg,
        c.id_usuario_mod,
        c.fecha_reg::varchar,
        c.fecha_mod::varchar,
        c.fecha_fin_servicio::varchar,
        c.direccion,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        u.name as usuario_reg,
        us.name as usuario_mod
        from ras.tcliente c
        join ras.tpersona p on p.id_persona=c.id_persona
        left join segu.users u on u.id=c.id_usuario_reg
        left join segu.users us on us.id=c.id_usuario_mod
        order by c.id_cliente desc ");

        $arrayParametros=[
            'cliente'=>$cliente
        ];
        
        return response()->json($arrayParametros);

    }
    public function get_cliente($id)
    {

        $clientes=DB::select("select  
        c.id_cliente,
        c.id_persona,
        c.id_usuario_reg,
        c.id_usuario_mod,
        c.fecha_reg,
        c.fecha_mod,
        c.fecha_fin_servicio,
        c.direccion,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        u.name as usuario_reg,
        us.name as usuario_mod
        from ras.tcliente c
        join ras.tpersona p on p.id_persona=c.id_persona
        left join segu.users u on u.id=c.id_usuario_reg
        left join segu.users us on us.id=c.id_usuario_mod
        where c.id_cliente = ? ",[$id]);
                    
        
        $personas=DB::select("select 
                    p.id_persona,
                    p.nombre,
                    p.apellido_paterno,
                    p.apellido_materno,
                    p.ci,
                    p.celular
                    from ras.tpersona p
                    where p.estado = ? ",["activo"]);

        $id_persona = 0;
        if($id!=0){
                $id_persona = $clientes[0]->id_persona;
        }
        $persona_seleccionado=DB::select("select 
                    p.id_persona,
                    p.nombre,
                    p.apellido_paterno,
                    p.apellido_materno,
                    p.ci,
                    p.celular
                    from ras.tpersona p
                    where p.estado = ? and p.id_persona=? ",["activo" ,$id_persona ]);

        //return $json;
        $arrayParametros=[
            'cliente'=>$clientes,
            'personas'=>$personas,
            'persona_seleccionado'=>$persona_seleccionado
        ];
        
        return response()->json($arrayParametros);
    }
    public function post_cliente(Request $request){
        $validacion = $this->validar_cliente($request);

        if($request->id_cliente==0){
            if((bool)$validacion["validacion"]==true){
                DB::insert('insert into ras.tcliente(direccion,id_persona,id_usuario_reg,fecha_reg)
                values(?,?,?,now()::timestamp)',[$request->direccion,(int)$request->id_persona,$request->user()->id]);
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){
                DB::update('update ras.tcliente 
                set direccion=?,
                id_persona=?,
                id_usuario_mod=?,
                fecha_mod= now()::timestamp
                where id_cliente=?',
                [$request->direccion,(int)$request->id_persona,$request->user()->id,$request->id_cliente]);
                
            }
        }

        $arrayParametros=[
        'mensaje'=>$validacion["mensaje"],
        'validacion'=>$validacion["validacion"]
        ];

        return response()->json($arrayParametros);  
    }
    public function validar_cliente($request){
        $mensaje=[];
        $validacion=true;

        if($request->id_cliente!=0){

            $duplicado_cliente=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tcliente c where c.id_persona = ? and c.id_cliente != ? ',[$request->id_persona,$request->id_cliente]);
            if((int)($duplicado_cliente[0]->cantidad)>0){
                array_push($mensaje,'El campo persona ya esta registrado');
                $validacion=false;
            }
           
        }
        else{

            $duplicado_cliente=DB::select('select 
                                            count(*)::integer as cantidad  
                                            from ras.tcliente c where c.id_persona = ?  ',[$request->id_persona]);

            if((int)($duplicado_cliente[0]->cantidad)>0){
                array_push($mensaje,'El campo persona ya esta registrado');
                $validacion=false;
            }

        }


        $arrayParametros=[
        'mensaje'=>$mensaje,
        'validacion'=>$validacion
        ];

        return $arrayParametros;
    }
    public function eliminar_cliente($id){

        db::update('delete from ras.tvehiculo where id_cliente = ? ',[$id]);
        db::update('delete from ras.tcliente where id_cliente = ? ',[$id]);

        $arrayParametros=[
          'mensaje'=>"ok"
        ];
        return $arrayParametros;
    }
    public function get_pagos_cliente($id_cliente){
      
        $servicio=DB::select("select
                                id_pago_servicio,
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
                                c.id_cliente
                            from  ras.tcliente c
                                join ras.tservicio s on s.id_cliente=c.id_cliente
                                join ras.tpago_servicio ps on ps.id_servicio=s.id_servicio
                                join ras.tpersona p on p.id_persona=c.id_persona
                                join segu.users us on us.id_persona=p.id_persona
                            where c.id_cliente = ?::INTEGER 
                            order by p.nombre,p.apellido_paterno,p.apellido_materno,ps.fecha_inicio,ps.fecha_fin ",[$id_cliente]);

        $arrayParametros=[
            'pago_servicio'=>$servicio
        ];

        return response()->json($arrayParametros);
    }
    public function post_pagos_cliente(Request $request){

        $validacion = $this->validar_pago($request);

        $cantidad_servicio=db::select('select count(*) as cantidad
        from ras.tcliente c
        join ras.tservicio s on s.id_cliente = c.id_cliente
        where c.id_cliente = ?::integer ',[$request->id_cliente]);

        //verificamos que exista un servicio para el cliente y sino insertamos el servicio por defecto tipo_servicio = 1
        if((int)$cantidad_servicio[0]->cantidad > 0 ){
            $servicio=db::select('select s.id_servicio
            from ras.tcliente c
            join ras.tservicio s on s.id_cliente = c.id_cliente
            where c.id_cliente = ?::integer ',[$request->id_cliente]);
        }else{
            db::insert('insert into ras.tservicio (id_cliente,id_usuario_reg,costo_total,fecha_reg,id_tipo_servicio) VALUES (?::integer,?::integer,?::numeric,now()::TIMESTAMP,1 ) ',
                [$request->id_cliente,$request->user()->id,$request->sub_total]);
            $servicio=db::select('select s.id_servicio
            from ras.tcliente c
            join ras.tservicio s on s.id_cliente = c.id_cliente
            where c.id_cliente = ?::integer ',[$request->id_cliente]);
        }

        if( (int)($request->id_pago_servicio) == 0 ){
            
            db::insert('INSERT INTO ras.tpago_servicio (precio_mensual,fecha_inicio,fecha_fin,cantidad_vehiculos,cantidad_meses,sub_total,fecha_pago,id_usuario_reg,id_servicio) 
            VALUES (?::NUMERIC,?::TIMESTAMP,?::TIMESTAMP,?::INTEGER,?::INTEGER,?::NUMERIC,?::TIMESTAMP,?,?  ) '
                ,[$request->precio_mensual,$request->fecha_inicio,$request->fecha_fin,$request->cantidad_vehiculos,$request->cantidad_meses,$request->sub_total,$request->fecha_pago,(int)$request->user()->id,(int)$servicio[0]->id_servicio ]);
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
                ,[$request->precio_mensual,$request->fecha_inicio,$request->fecha_fin,$request->cantidad_vehiculos,$request->cantidad_meses,$request->sub_total,$request->fecha_pago,$servicio[0]->id_servicio,(int)$request->id_pago_servicio ]);
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
    public function get_servicios($id_cliente){

        $lista_servicios=db::select("select
        s.id_servicio,s.id_cliente,s.costo_total,
        s.id_tipo_servicio,ts.tipo_servicio,ts.codigo
        from ras.tservicio s
        join ras.ttipo_servicio ts on ts.id_tipo_servicio=s.id_tipo_servicio
        where s.id_cliente = ? ",[$id_cliente]);

        $lista_tipo_servicio = db::select('select ts.id_tipo_servicio,ts.tipo_servicio,ts.codigo
        from ras.ttipo_servicio ts');

        $lista_tipo_servicio_seleccionado = db::select('select ts.id_tipo_servicio,ts.tipo_servicio,ts.codigo
        from ras.ttipo_servicio ts
        join ras.tservicio s on s.id_tipo_servicio=ts.id_tipo_servicio
        where s.id_cliente = ?::integer ',[$id_cliente]);

        $arrayParametros=[
            'lista_servicios'=>$lista_servicios,
            'lista_tipo_servicio'=>$lista_tipo_servicio,
            'lista_tipo_servicio_seleccionado'=>$lista_tipo_servicio_seleccionado,
        ];

        return response()->json($arrayParametros);

    }
    public function post_servicio(Request $request){

        $validacion = $this->validar_servicio($request);

        if( (int)($request->id_servicio) == 0 ){
            
            db::insert('insert into ras.tservicio (id_cliente,id_usuario_reg,costo_total,fecha_reg,id_tipo_servicio)
            values (?::integer,?::integer,?::numeric,now()::timestamp,?::integer)'
                ,[(int)$request->id_cliente,(int)$request->user()->id,$request->costo_total,$request->id_tipo_servicio ]);
        }else{
            db::insert('update ras.tservicio set
            id_cliente = ?::integer,
            id_usuario_mod = ?::integer,
            costo_total = ?,
            fecha_mod = now()::timestamp,
            id_tipo_servicio = ?::integer
        where id_servicio = ?::integer '
                ,[(int)$request->id_cliente,(int)$request->user()->id,$request->costo_total,$request->id_tipo_servicio,$request->id_servicio ]);
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
}