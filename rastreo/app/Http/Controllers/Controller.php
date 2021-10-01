<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

use Illuminate\Http\Request;//juan
use DB;//juan


class Controller extends BaseController
{
	protected $accesos=[];//juan
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

	public function verificarAcceso(Request $request){//juan
   
        //$id=auth()->id();
        $id=$request->user()->id;

        $usuario=DB::select(' select count(*)::integer as cantidad from segu.users u where u.id=? and u.estado=? ',[$id,"inactivo"]);
        if((int)($usuario[0]->cantidad)>0){//bloquear a usuarios inactivos
          Auth::logout();
          return false;
        }
        
        $ruta=$request->route()->getActionMethod();
        $permitir=$this->permitir($id,$ruta);
        
        if (!\Auth::check() || $permitir!=true) {

            return false;
        }
        return true;

	}
    public function permitir($id,$ruta){//juan
        $bandera=false;
        $permisos=DB::select("
                            WITH permisos AS(
                            select ur.id_rol,r.id_permisos,ur.id_usuario 
                            from ras.trol r
                            join ras.tusuario_rol ur on ur.id_rol=r.id_rol
                            )
                            select p.id_permiso,
                            p.ruta,
                            p.nombre_acceso, 
                            lower(p.nombre_acceso) as boton,
                            case when  p2.ruta is not null then true else false end::varchar as acceso,
                            p.codigo
                            from segu.tpermiso p
                            left join segu.tpermiso p2 on p2.id_permiso=p.id_permiso 
                            and p.id_permiso::varchar in (select unnest(per.id_permisos) from permisos per where per.id_usuario=? )
                            ",[$id]);

        for ($i=0; $i < count($permisos); $i++) { 
               $this->accesos[$permisos[$i]->ruta]=$permisos[$i]->acceso; 
        }
        $permisos=DB::select("WITH permisos AS(
                            select ur.id_rol,r.id_permisos,ur.id_usuario 
                            from ras.trol r
                            join tusuario_rol ur on ur.id_rol=r.id_rol
                            )
                            select count(*) as cantidad
                            from segu.tpermiso p
                            join segu.tpermiso p2 on p2.id_permiso=p.id_permiso 
                            and p.id_permiso::varchar in (select unnest(per.id_permisos) from permisos per where per.id_usuario=?)
                            where p.ruta::varchar= ?::varchar ",[$id,$ruta]);

        if((int)($permisos[0]->cantidad)>0){
           $bandera =true;
        }
        return $bandera;
    }
    public function get_accesos($id){

        $this->accesos=[];
        $permisos=DB::select("
                            WITH permisos AS(
                            select ur.id_rol,r.id_permisos,ur.id_usuario 
                            from ras.trol r
                            join ras.tusuario_rol ur on ur.id_rol=r.id_rol
                            )
                            select p.id_permiso,
                            p.ruta,
                            p.nombre_acceso, 
                            lower(p.nombre_acceso) as boton,
                            case when  p2.ruta is not null then true else false end::varchar as acceso,
                            p.codigo
                            from segu.tpermiso p
                            left join segu.tpermiso p2 on p2.id_permiso=p.id_permiso 
                            and p.id_permiso::varchar in (select unnest(per.id_permisos) from permisos per where per.id_usuario=? )
                            ",[$id]);

        for ($i=0; $i < count($permisos); $i++) { 
               $this->accesos[$permisos[$i]->ruta]=$permisos[$i]->acceso; 
        }
 
        return $this->accesos;
    }
    public function es_admin($id){
        $id_usuario=$id;
        $id_permisos=DB::select("select  array_to_string( ARRAY_AGG ( array_to_string (r.id_permisos, ?, ?) ),? )::varchar  as id_permisos
        from segu.users u
        join ras.tusuario_rol ur on ur.id_usuario=u.id
        join ras.trol r on r.id_rol=ur.id_rol
        where u.id=? and array_to_string (r.id_permisos, ?, ?) !=? ",[",","0",",",$id_usuario,",","0",""]); 

        $es_admin=DB::select("select  
        count(r.nombre_rol) as cantidad
        from segu.users u
        join ras.tusuario_rol ur on ur.id_usuario=u.id
        join ras.trol r on r.id_rol=ur.id_rol
        join segu.tpermiso p on p.id_permiso in (".$id_permisos[0]->id_permisos.")
        where u.id=? and r.nombre_rol=? 
        ",[ $id_usuario,"admin"]);

        $bandera=false;
        if((int)($es_admin[0]->cantidad)>0){
            $bandera=true;
        }

        return $bandera;
    }

}
