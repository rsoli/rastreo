<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use DB;

class RolController extends Controller
{

    public function lista_rol(Request $request)
    {
        $roles=DB::select("select 
                         r.id_rol,
                         r.nombre_rol,
                         r.fecha_reg::varchar,
                         r.fecha_mod::varchar
                         from ras.trol r
                          where r.estado = ?  ",["activo"]);

        $arrayParametros=[
            'roles'=>$roles
        ];
        
        return response()->json($arrayParametros);

    }
    public function get_rol($id)
    {
        
        $rol=DB::select("select 
                        r.id_rol,
                        r.nombre_rol 
                        from ras.trol r
                        where r.id_rol = ? and r.estado = ? ",[$id,"activo"]);


         $json = $this->get_menu(); 
         $json_permisos=$this->get_permisos($id);

        //return $json;
        $arrayParametros=[
            'rol'=>$rol,
            'menu'=>response()->json( $json[0]->json_tree),
            'permisos'=>response()->json( $json_permisos)
        ];
        
        return response()->json($arrayParametros);
    }
    function get_permisos($id){
        $my_array=DB::select("with roles as(
                              SELECT 
                              r.id_rol,
                              r.id_permisos
                              from ras.trol r
                            ),
                            permiso as(
                            select 
                            p.id_permiso as key
                            from segu.tpermiso p
                           -- where p.href = 1
                            )

                            select 
                             p.* as key
                            from permiso p
                            where  p.key::varchar  in (SELECT unnest(pp.id_permisos) FROM roles pp where pp.id_rol=? )
                                                        ",[$id]);
        return $my_array;
    }
    function get_menu() {

        $my_array=DB::select("with recursive primer as (select c.id_permiso as data,
                                c.id_padre,
                                c.nombre_acceso as label,
                                c.expandedicon as expandedIcon ,
                                c.collapsedicon as collapsedIcon,
                                
                                0 as lvl,
                                c.id_permiso as key 

                        from segu.tpermiso c
                        where c.id_padre is null
                        union all    
                        select  ch.id_permiso as data, 
                                ch.id_padre,
                                ch.nombre_acceso as label,
                                ch.expandedicon as expandedIcon,
                                ch.collapsedicon as collapsedIcon,
                                pr.lvl + 1 as lvl,
                                ch.id_permiso as key 

                        from segu.tpermiso ch
                        inner join primer pr ON pr.data = ch.id_padre  ),
                        maxlvl as ( select max(lvl) 
                                maxlvl 
                        from primer),
                        segundo as (
                        select primer.*, 
                        jsonb '[]' children
                        from primer, maxlvl
                        where lvl = maxlvl
                        union
                        (
                        select (pri).*, 
                        jsonb_agg(seg)
                        from (
                        select pri, 
                            seg
                        from primer pri
                        inner join segundo seg on seg.id_padre = pri.data
                        ) branch
                        group by branch.pri

                        union

                        select c.data,
                        c.id_padre,
                        c.label,
                        c.expandedIcon,
                        c.collapsedIcon,
                        c.lvl,
                        c.key, 
                        jsonb '[]' children
                        from   primer c
                        where  not  exists  (select 1 from primer pri where pri.id_padre = c.data)
                        )         
                        )
                        select jsonb_pretty(row_to_json( segundo )::jsonb) ::text json_tree
                        from segundo
                        where lvl = 0
                        order by  lvl;"); 

        return $my_array;

    }
    public function post_rol(Request $request){

        $validacion = $this->validar_rol($request);

        if($request->id_rol==0){
            if((bool)$validacion["validacion"]==true){
               DB::insert('insert into ras.trol (nombre_rol,estado,id_permisos,fecha_reg) values(?,?,?,now()::TIMESTAMP );',[$request->nombre_rol,"activo",'{'.$request->id_arbol.'}' ]);
            }
        }
        else{
            if((bool)$validacion["validacion"]==true){
               DB::update('update ras.trol set nombre_rol =?,id_permisos=?,fecha_mod=now()::TIMESTAMP where id_rol=?; ',[$request->nombre_rol,'{'.$request->id_arbol.'}',$request->id_rol]);
            }
        }

        $rol=DB::select("select 
                        r.id_rol,
                        r.nombre_rol 
                        from ras.trol r
                        ");

        $arrayParametros=[
            'mensaje'=>$validacion["mensaje"],
            'validacion'=>$validacion["validacion"],
            'rol'=>$rol
        ]; 

        return response()->json($arrayParametros);
        
    }
    public function validar_rol($request){
        $mensaje=[];
        $validacion=true;
        if($request->id_rol!=0){
            $dubicado_rol=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from ras.trol r 
                                      where  trim(upper(r.nombre_rol))=trim(upper(?)) and r.id_rol != ? and r.estado=? ',[$request->nombre_rol,$request->id_rol,"activo"]);
            if((int)($dubicado_rol[0]->cantidad)>0){
                array_push($mensaje,'El nombre rol ya esta registrado');
                $validacion=false;
            }
           
        }
        else{
            $dubicado_rol=DB::select('select 
                                      count(*)::integer as cantidad  
                                      from ras.trol r
                                      where  trim(upper(r.nombre_rol))=trim(upper(?)) and r.estado=? ',[$request->nombre_rol,"activo"]);
            if((int)($dubicado_rol[0]->cantidad)>0){
                array_push($mensaje,'El nombre rol ya esta registrado');
                $validacion=false;
            }
        }
        $arrayParametros=[
            'mensaje'=>$mensaje,
            'validacion'=>$validacion
        ];
        return $arrayParametros;
    }
    public function eliminar_rol($id){
        db::update('update  ras.trol set estado=? where id_rol=? ',["inactivo",$id]);

        $roles=DB::select("select 
                         r.id_rol,
                         r.nombre_rol 
                         from ras.trol r
                          where r.estado = ?  ",["activo"]);

        $arrayParametros=[
            'roles'=>$roles
        ];
        
        return response()->json($arrayParametros);
    }

    /////////////////////nuevo formato de framework///////////////////////////
    public function lista_roles(Request $request)
    {
        // Consulta para obtener los roles y sus permisos
        $roles = DB::select("
SELECT 
    r.id_rol, 
    r.nombre_rol, 
    r.fecha_reg::varchar,
    r.fecha_mod::varchar,
    r.estado,
    jsonb_pretty(
        json_agg(
            json_build_object(
                'key', p.id_permiso, 
                'label', p.nombre_acceso
            )
        )::jsonb
    ) AS id_permisos
FROM ras.trol r
JOIN LATERAL unnest(r.id_permisos) AS permiso_id ON TRUE
JOIN segu.tpermiso p ON p.id_permiso = CAST(permiso_id AS integer)
WHERE  p.ruta_menu_sidebar IS NOT NULL and r.estado='activo'
GROUP BY r.id_rol, r.nombre_rol
");




        // Retorna la lista de roles con permisos
        $arrayParametros = [
            'roles' => $roles
        ];

        return response()->json($arrayParametros);
    }

    public function post_roles(Request $request){

        $validacion = $this->validar_rol($request);

        $id_permisos = '{' . implode(',', $request->id_arbol) . '}';
        if((bool)$validacion["validacion"]==true){
            if($request->id_rol==0){
                DB::insert('insert into ras.trol (nombre_rol,estado,id_permisos,fecha_reg) values(?,?,?,now()::TIMESTAMP );',[$request->nombre_rol,"activo",$id_permisos ]);
            }
            else{
                DB::update('update ras.trol set nombre_rol =?,id_permisos=?,fecha_mod=now()::TIMESTAMP where id_rol=?; ',[$request->nombre_rol,$id_permisos,$request->id_rol]);
            }
        }


        $arrayParametros=[
            'mensaje'=>$validacion["mensaje"],
            'validacion'=>$validacion["validacion"]
        ];

        return response()->json($arrayParametros);

    }

    public function lista_permisos(Request $request)
    {
        // Consulta para obtener todos los permisos
        $permisos = DB::select("
        SELECT 
            p.id_permiso,
            p.id_padre,
            p.nombre_acceso
        FROM segu.tpermiso p
    ");

        // Convertimos los permisos a un array asociativo para construir el árbol
        $permisosArray = [];
        foreach ($permisos as $permiso) {
            $permisosArray[] = [
                'key' => $permiso->id_permiso,  // Cambiado a 'key' para tu formato
                'parent' => $permiso->id_padre,  // Si es null, es un nodo raíz
                'label' => $permiso->nombre_acceso,
                'data' => 'Permiso: ' . $permiso->nombre_acceso, // Agregando 'data' para el contenido adicional
                'icon' => 'pi pi-fw pi-lock', // Puedes personalizar el icono
                'children' => [] // Inicializamos como vacío
            ];
        }

        // Construir la estructura de árbol
        $lista_permisos = $this->buildTree($permisosArray);

        // Crear el array en el formato que necesitas
        $arrayParametros = [
            'roles' => $lista_permisos // Cambiado a 'roles' para coincidir con tu estructura
        ];

        return response()->json($arrayParametros);
    }

    private function buildTree(array &$elements, $parentId = null)
    {
        $branch = [];
        foreach ($elements as &$element) {
            if ($element['parent'] == $parentId) {
                $children = $this->buildTree($elements, $element['key']); // Cambiado a 'key'
                if ($children) {
                    $element['children'] = $children;
                }
                $branch[] = [
                    'key' => $element['key'], // Cambiado a 'key'
                    'label' => $element['label'], // No cambia
                    'data' => $element['data'], // Agregado 'data'
                    'icon' => $element['icon'], // Agregado 'icon'
                    'children' => $element['children']
                ];
            }
        }
        return $branch;
    }

    public function post_roles_admin(Request $request)
    {
        // Validar los datos que llegan en la solicitud
        $validacion = $this->validar_rol($request);

        // Extraer solo los valores 'key' del array de permisos
        $id_permisos_array = array_column($request->id_permisos, 'key');

        // Convertir el array en un formato compatible con PostgreSQL (ej. {1,2,3})
        $id_permisos = '{' . implode(',', $id_permisos_array) . '}';

        if((bool)$validacion["validacion"] == true) {
            if($request->id_rol == 0) {
                // Insertar un nuevo rol con los permisos
                DB::insert(
                    'insert into ras.trol (nombre_rol, estado, id_permisos, fecha_reg) values (?, ?, ?, now()::TIMESTAMP)',
                    [$request->nombre_rol, "activo", $id_permisos]
                );
            } else {
                // Actualizar un rol existente con los nuevos permisos
                DB::update(
                    'update ras.trol set nombre_rol = ?, id_permisos = ?, fecha_mod = now()::TIMESTAMP where id_rol = ?',
                    [$request->nombre_rol, $id_permisos, $request->id_rol]
                );
            }
        }

        // Respuesta con el resultado de la validación
        $arrayParametros = [
            'mensaje' => $validacion["mensaje"],
            'validacion' => $validacion["validacion"]
        ];

        return response()->json($arrayParametros);
    }


}