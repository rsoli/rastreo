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

    //////////////////////////////////////// Api traccar  /////////////////////////////////////////

    public function post_geocerca($cookies,$nombre_geocerca,$description,$area_geocerca){

        $id='-1';
        $name=$nombre_geocerca;
        $description=$description;
        $area=$area_geocerca;
        $calendarId='0';
        $attributes='{}';

        $data='{
                "id":'.$id.',
                "name":"'.$name.'",
                "description":"'.$description.'",
                "area":"'.$area.'",
                "calendarId":'.$calendarId.',
                "attributes":'.$attributes.
            '}';


        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://rsoli.com:8082/api/geofences',

            CURLOPT_POST=> true,

            CURLOPT_RETURNTRANSFER => true,
            //curl_setopt($curl, CURLOPT_HEADER, 1),
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS =>  $data,

            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                "Cookie: JSESSIONID=".$cookies["JSESSIONID"]
            ),
        ));

        $response = curl_exec($curl);
        $res=json_decode($response, true);


        curl_close($curl);
    }

    public function put_geocerca($cookies,$id_geocerca,$nombre_geocerca,$description,$area_geocerca){

        $id=$id_geocerca;
        $name=$nombre_geocerca;
        $description=$description;
        $area=$area_geocerca;
        $calendarId='0';
        $attributes='{}';

        $data='{
                "id":'.$id.',
                "name":"'.$name.'",
                "description":"'.$description.'",
                "area":"'.$area.'",
                "calendarId":'.$calendarId.',
                "attributes":'.$attributes.
            '}';


        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://rsoli.com:8082/api/geofences/'.$id,

            //CURLOPT_POST=> true,

            CURLOPT_RETURNTRANSFER => true,
            //curl_setopt($curl, CURLOPT_HEADER, 1),
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'PUT',
            CURLOPT_POSTFIELDS =>  $data,

            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                "Cookie: JSESSIONID=".$cookies["JSESSIONID"]
            ),
        ));

        $response = curl_exec($curl);
        $res=json_decode($response, true);


        curl_close($curl);
    }

    public function delete_geocerca($cookies,$id){

        $id=$id;
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://rsoli.com:8082/api/geofences/'.$id,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'DELETE',
            //CURLOPT_POSTFIELDS =>  $data,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                "Cookie: JSESSIONID=".$cookies["JSESSIONID"]
            ),
        ));

        $response = curl_exec($curl);


        curl_close($curl);

    }

    public function put_device($cookies,$id_dispositivo,$nombre_dispositivo,$imei){

        $id=$id_dispositivo;
        $name=$nombre_dispositivo;
        $uniqueId=$imei;
        $status='';
        $disabled='false';
        $lastUpdate='null';
        $positionId='0';
        $groupId='0';
        $phone='';
        $model='';
        $contact='';
        $category='';
        $geofenceIds='[0]';
        $attributes='{}';

        $data='{
                "id":'.$id.',
                "name":"'.$name.'",
                "uniqueId":"'.$uniqueId.'",
                "status":"'.$status.'",
                "disabled":"'.$disabled.'",
                "lastUpdate":"'.$lastUpdate.'",
                "positionId":'.$positionId.',
                "groupId":'.$groupId.',
                "phone":"'.$phone.'",
                "model":"'.$model.'",
                "contact":"'.$contact.'",
                "category":"'.$category.'",
                "geofenceIds":'.$geofenceIds.',
                "attributes":'.$attributes.
            '}';



        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://rsoli.com:8082/api/devices/'.$id,

            //CURLOPT_PUT=> true,
            CURLOPT_RETURNTRANSFER => true,
            //curl_setopt($curl, CURLOPT_HEADER, 1),
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'PUT',
            CURLOPT_POSTFIELDS =>  $data,

            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                "Cookie: JSESSIONID=".$cookies["JSESSIONID"]
            ),
        ));

        $response = curl_exec($curl);
        $res=json_decode($response, true);


        var_dump($res);

        curl_close($curl);
    }

    public function delete_device($cookies,$id){


        $id=$id;
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://rsoli.com:8082/api/devices/'.$id,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'DELETE',
            //CURLOPT_POSTFIELDS =>  $data,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                "Cookie: JSESSIONID=".$cookies["JSESSIONID"]
            ),
        ));

        $response = curl_exec($curl);
        //echo "string".$response;
        //$res=json_decode($response, true);

        /*foreach($res as $item) {
            var_dump($item['name']);
        }*/

        curl_close($curl);


    }

    public function post_device($cookies,$nombre_dispositivo,$imei){


        $id='-1';
        $name=$nombre_dispositivo;
        $uniqueId=$imei;
        $status='';
        $disabled='false';
        $lastUpdate='null';
        $positionId='0';
        $groupId='0';
        $phone='';
        $model='';
        $contact='';
        $category='';
        $geofenceIds='[0]';
        $attributes='{}';

        $data='{
                "id":'.$id.',
                "name":"'.$name.'",
                "uniqueId":"'.$uniqueId.'",
                "status":"'.$status.'",
                "disabled":"'.$disabled.'",
                "lastUpdate":"'.$lastUpdate.'",
                "positionId":'.$positionId.',
                "groupId":'.$groupId.',
                "phone":"'.$phone.'",
                "model":"'.$model.'",
                "contact":"'.$contact.'",
                "category":"'.$category.'",
                "geofenceIds":'.$geofenceIds.',
                "attributes":'.$attributes.
            '}';



        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://rsoli.com:8082/api/devices',

            CURLOPT_POST=> true,

            CURLOPT_RETURNTRANSFER => true,
            //curl_setopt($curl, CURLOPT_HEADER, 1),
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS =>  $data,

            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                "Cookie: JSESSIONID=".$cookies["JSESSIONID"]
            ),
        ));

        $response = curl_exec($curl);
        $res=json_decode($response, true);


        curl_close($curl);

    }

    public function get_device($cookies){

        //echo($cookies);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://rsoli.com:8082/api/devices',
            CURLOPT_RETURNTRANSFER => true,

            //curl_setopt($curl, CURLOPT_HEADER, 1),

            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_POSTFIELDS => 'email=admin&password=75319462',
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                "Cookie: JSESSIONID=".$cookies["JSESSIONID"]
            ),
        ));

        $response = curl_exec($curl);
        $res=json_decode($response, true);


        foreach($res as $item) {
            var_dump($item['name']);
        }


        //var_dump($cookies);

        curl_close($curl);

    }

    public function iniciar_sesion(){
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://rsoli.com:8082/api/session',
            CURLOPT_RETURNTRANSFER => true,

            curl_setopt($curl, CURLOPT_HEADER, 1),

            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => 'email=admin&password=75319462',
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/x-www-form-urlencoded',
                // 'Cookie: JSESSIONID=node0spbxks097p05bxx5mupjqry13638.node0'
                "Cookie: Name=Value",
            ),
        ));

        $response = curl_exec($curl);


        preg_match_all('/^Set-Cookie:\s*([^;]*)/mi', $response, $matches);
        $cookies = array();
        foreach($matches[1] as $item) {
            parse_str($item, $cookie);
            $cookies = array_merge($cookies, $cookie);
        }
        //var_dump($response);
        //var_dump($cookies);

        curl_close($curl);

        return $cookies;
    }

    public function cerrar_sesion($cookies){

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'http://rsoli.com:8082/api/session',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'DELETE',
            //CURLOPT_POSTFIELDS =>  $data,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                "Cookie: JSESSIONID=".$cookies["JSESSIONID"]
            ),
        ));

        $response = curl_exec($curl);


        curl_close($curl);
    }

}
