<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ClaimController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ItemController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::get('/categories', [CategoryController::class, 'index'])->middleware('throttle:60,1');
Route::get('/items', [ItemController::class, 'index'])->middleware('throttle:60,1');
Route::get('/items/{item}', [ItemController::class, 'show'])->middleware('throttle:60,1');
Route::post('/items', [ItemController::class, 'store'])->middleware('throttle:10,1');
Route::post('/items/{item}/comments', [CommentController::class, 'store'])->middleware('throttle:20,1');
Route::post('/items/{item}/claims', [ClaimController::class, 'store'])->middleware('throttle:10,1');
Route::get('/items/{item}/claims', [ClaimController::class, 'index'])->middleware('throttle:30,1');
Route::patch('/items/{item}/claims/{claim}', [ClaimController::class, 'updateStatus'])
    ->middleware('throttle:30,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
