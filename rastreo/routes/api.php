<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PassportAuthController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\ServicioController;

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
    });
});

// Route::middleware('auth:api')->group(function () {
//     Route::resource('posts', PostController::class);
// });
 