<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PassportAuthController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\ParametrosController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\ChoferController;
use App\Http\Controllers\EntregaController;
use App\Http\Controllers\ZonaController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('register', [PassportAuthController::class, 'register']);
Route::post('login', [PassportAuthController::class, 'login']);
Route::post('iniciar_sesion', [PassportAuthController::class, 'iniciar_sesion']);
//Route::get('get_menu', [PassportAuthController::class, 'get_menu']);

Route::group([
    'prefix' => 'auth'
], function () {
    
    Route::group([
      'middleware' => 'auth:api'
    ], function() {
        Route::get('get_menu', [PassportAuthController::class, 'get_menu']);
        Route::get('cerrar_sesion', [PassportAuthController::class, 'cerrar_sesion']);
        Route::get('get_usuarios', [PassportAuthController::class, 'get_usuarios']);
        Route::get('get_usuario/{id}', [PassportAuthController::class, 'get_usuario']);
        Route::post('post_usuario', [PassportAuthController::class, 'post_usuario']);
        Route::get('eliminar_usuario/{id}', [PassportAuthController::class, 'eliminar_usuario']);

        Route::get('lista_usuarios', [PassportAuthController::class, 'lista_usuarios']);
        Route::post('post_cambio_contrasena', [PassportAuthController::class, 'post_cambio_contrasena']);


    });
});

Route::group([
    'prefix' => 'persona'
], function () {
    
    Route::group([
      'middleware' => 'auth:api'
    ], function() {

        Route::get('lista_persona', [PersonaController::class, 'lista_persona']);
        Route::post('post_persona', [PersonaController::class, 'post_persona']);
        Route::get('eliminar_persona/{id}', [PersonaController::class, 'eliminar_persona']);
    });
});

Route::group([
    'prefix' => 'rol'
], function () {
    
    Route::group([
      'middleware' => 'auth:api'
    ], function() {

        Route::get('lista_rol', [rolController::class, 'lista_rol']);
        Route::get('get_rol/{id}', [rolController::class, 'get_rol']);
        Route::post('post_rol', [rolController::class, 'post_rol']);
        Route::get('eliminar_rol/{id}', [rolController::class, 'eliminar_rol']);

        Route::get('lista_roles', [rolController::class, 'lista_roles']);
        Route::post('post_roles', [rolController::class, 'post_roles']);
        Route::get('lista_permisos', [rolController::class, 'lista_permisos']);

        Route::post('post_roles_admin', [rolController::class, 'post_roles_admin']);

    });
});

Route::group([
    'prefix' => 'servicio'
], function () {
    
    Route::group([
      'middleware' => 'auth:api'
    ], function() {

        Route::get('lista_servicio', [ServicioController::class, 'lista_servicio']);
        Route::get('lista_pago_servicio/{id}', [ServicioController::class, 'lista_pago_servicio']);
        Route::get('filtros_monitoreo', [ServicioController::class, 'filtros_monitoreo']);
        Route::post('monitoreo_tiempo_real', [ServicioController::class, 'monitoreo_tiempo_real']);
        Route::post('monitoreo_rutas', [ServicioController::class, 'monitoreo_rutas']);
        Route::post('reporte_parqueos', [ServicioController::class, 'reporte_parqueos']);
        Route::get('lista_geocercas', [ServicioController::class, 'lista_geocercas']);
        Route::post('post_geocerca', [ServicioController::class, 'post_geocerca']);
        Route::get('eliminar_geocerca/{id}', [ServicioController::class, 'eliminar_geocerca']);
        Route::get('lista_pago_servicio_usuario', [ServicioController::class, 'lista_pago_servicio_usuario']);
        Route::get('lista_geocercas_seleccionados/{id}', [ServicioController::class, 'lista_geocercas_seleccionados']);
        Route::post('post_geocercas_seleccionados', [ServicioController::class, 'post_geocercas_seleccionados']);

        Route::get('lista_servicio_cliente/{id}', [ServicioController::class, 'lista_servicio_cliente']);
        Route::get('lista_tipo_servicio', [ServicioController::class, 'lista_tipo_servicio']);
        Route::post('post_servicio', [ServicioController::class, 'post_servicio']);
        Route::get('eliminar_servicio/{id}', [ServicioController::class, 'eliminar_servicio']);

        Route::get('lista_pagos_cliente/{id}', [ServicioController::class, 'lista_pagos_cliente']);
        Route::post('post_pagos_cliente', [ServicioController::class, 'post_pagos_cliente']);
        Route::get('eliminar_pagos_cliente/{id}', [ServicioController::class, 'eliminar_pagos_cliente']);
        Route::get('lista_pago_servicio_cliente/{id}', [ServicioController::class, 'lista_pago_servicio_cliente']);

        Route::post('post_geocercas_dispositivo', [ServicioController::class, 'post_geocercas_dispositivo']);


    });
});

Route::group([
    'prefix' => 'parametros'
], function () {
    
    Route::group([
      'middleware' => 'auth:api'
    ], function() {

        Route::get('lista_departamento', [ParametrosController::class, 'lista_departamento']);
        Route::post('post_departamento', [ParametrosController::class, 'post_departamento']);
        Route::get('eliminar_departamento/{id}', [ParametrosController::class, 'eliminar_departamento']);

        Route::get('lista_gestion', [ParametrosController::class, 'lista_gestion']);
        Route::post('post_gestion', [ParametrosController::class, 'post_gestion']);

    });
});

Route::group([
    'prefix' => 'cliente'
], function () {
    
    Route::group([
      'middleware' => 'auth:api'
    ], function() {

        Route::get('lista_cliente', [ClienteController::class, 'lista_cliente']);
        Route::get('get_cliente/{id}', [ClienteController::class, 'get_cliente']);
        Route::post('post_cliente', [ClienteController::class, 'post_cliente']);
        Route::get('eliminar_cliente/{id}', [ClienteController::class, 'eliminar_cliente']);
        Route::get('get_pagos_cliente/{id}', [ClienteController::class, 'get_pagos_cliente']);
        Route::post('post_pagos_cliente', [ClienteController::class, 'post_pagos_cliente']);
        Route::get('eliminar_pagos_cliente/{id}', [ClienteController::class, 'eliminar_pagos_cliente']);
        Route::get('get_servicios/{id}', [ClienteController::class, 'get_servicios']);
        Route::post('post_servicio', [ClienteController::class, 'post_servicio']);
        Route::get('eliminar_servicio/{id}', [ClienteController::class, 'eliminar_servicio']);
        Route::get('get_pago_cliente/{id}', [ClienteController::class, 'get_pago_cliente']);

        Route::get('lista_clientes', [ClienteController::class, 'lista_clientes']);

    });                                                                                                     
});

Route::group([
    'prefix' => 'vehiculo'
], function () {
    
    Route::group([
      'middleware' => 'auth:api'
    ], function() {

        Route::get('lista_vehiculos/{id}', [VehiculoController::class, 'lista_vehiculos']);
        Route::get('lista_vehiculos_usuario', [VehiculoController::class, 'lista_vehiculos_usuario']);
        Route::get('get_vehiculo/{id}', [VehiculoController::class, 'get_vehiculo']);
        Route::post('post_vehiculo', [VehiculoController::class, 'post_vehiculo']);
        Route::get('eliminar_vehiculo/{id}', [VehiculoController::class, 'eliminar_vehiculo']);
        Route::post('inicio_traccar', [VehiculoController::class, 'inicio_traccar']);

        Route::get('lista_cliente_vehiculos/{id}', [VehiculoController::class, 'lista_cliente_vehiculos']);
        Route::post('post_cliente_vehiculo', [VehiculoController::class, 'post_cliente_vehiculo']);
        Route::get('lista_dispositivos', [VehiculoController::class, 'lista_dispositivos']);
        Route::post('post_enviarComando', [VehiculoController::class, 'post_enviarComando']);

    });                                                                                                     
});
// Route::middleware('auth:api')->group(function () {
//     Route::resource('posts', PostController::class);
// });
 
Route::group([
    'prefix' => 'chofer'
], function () {
    
    Route::group([
      'middleware' => 'auth:api'
    ], function() {

        Route::get('lista_chofer', [ChoferController::class, 'lista_chofer']);
        Route::post('post_chofer', [ChoferController::class, 'post_chofer']);
        Route::get('eliminar_chofer/{id}', [ChoferController::class, 'eliminar_chofer']);
    });
});

Route::group([
    'prefix' => 'entrega'
], function () {
    
    Route::group([
      'middleware' => 'auth:api'
    ], function() {

        Route::get('lista_entrega', [EntregaController::class, 'lista_entrega']);
        Route::post('post_entrega', [EntregaController::class, 'post_entrega']);
        Route::get('eliminar_entrega/{id}', [EntregaController::class, 'eliminar_entrega']);
        Route::get('get_entrega/{id}', [EntregaController::class, 'get_entrega']);
        
    });
});



Route::group([
    'prefix' => 'zona'
], function () {
    
    Route::group([
      'middleware' => 'auth:api'
    ], function() {

        Route::get('lista_geocercas', [ZonaController::class, 'lista_geocercas']);
        Route::post('post_geocerca', [ZonaController::class, 'post_geocerca']);
        Route::get('eliminar_geocerca/{id}', [ZonaController::class, 'eliminar_geocerca']);

        Route::get('lista_zona_grupo', [ZonaController::class, 'lista_zona_grupo']);
        Route::post('post_zona_grupo', [ZonaController::class, 'post_zona_grupo']);
        Route::get('eliminar_zona_grupo/{id}', [ZonaController::class, 'eliminar_zona_grupo']);

        Route::get('lista_zona_grupo_detalle/{id}', [ZonaController::class, 'lista_zona_grupo_detalle']);
        Route::post('post_zona_grupo_detalle', [ZonaController::class, 'post_zona_grupo_detalle']);
        Route::get('eliminar_zona_grupo_detalle/{id}', [ZonaController::class, 'eliminar_zona_grupo_detalle']);
        Route::get('get_zona/{id}', [ZonaController::class, 'get_zona']);
        

    });
});