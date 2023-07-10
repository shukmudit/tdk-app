<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('index');
});
Route::get('/checkout', function () {
    return view('checkout');
});
Route::get('/order_confirmed', function () {
    return view('order_confirmed');
});
Route::get('/cart', function () {
    return view('cart');
});
Route::get('admin/add_product', function () {
    return view('admin/add_product');
});
