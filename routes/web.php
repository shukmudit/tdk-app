<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CheckoutController;

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

Route::post('send_message',[CheckoutController::class,'send_message'])->name('send_message');
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
Route::get('admin/list_products', function () {
    return view('admin/list_products');
});
Route::get('admin/order_listing', function () {
    return view('admin/order_listing');
});
Route::get('admin/view_order', function () {
    return view('admin/view_order');
});