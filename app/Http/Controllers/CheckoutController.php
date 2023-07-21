<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
class CheckoutController extends Controller
{

public function send_message(Request $request){
  
  $cust_info = $request->input();
  $total = $cust_info['cust_total_amt'];
   $mobile = '+91'.$cust_info['phone_no']; 
    $params=array(
        'token' => 'hp6yx3eyxy1utnl0',
        'to' => $mobile,
        'body' => 'Hi, *'.$cust_info['your_name'].'*

*Order Confirmed!!* Will Get Delivered within 30 minutes.
        
Woohoo🎉🎉🤩

Your Order for  *Rs.'.$total.'/-* has been confirmed & will reach you shortly 🛳

Thanks for shopping with us! 😇

To Cancel Order Please Send *Cancel* or *Call Us* within 5 minutes.'
        );
        $curl = curl_init();
        curl_setopt_array($curl, array(
          CURLOPT_URL => "https://api.ultramsg.com/instance54813/messages/chat?token=hp6yx3eyxy1utnl0&to=+917302536237&body=WhatsApp+API+on+UltraMsg.com+works+good&priority=10",
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => "",
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 30,
          CURLOPT_SSL_VERIFYHOST => 0,
          CURLOPT_SSL_VERIFYPEER => 0,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => "POST",
          CURLOPT_POSTFIELDS => http_build_query($params),
          CURLOPT_HTTPHEADER => array(
            "content-type: application/x-www-form-urlencoded"
          ),
        ));
        
        $response = Http::post('https://api.ultramsg.com/instance54813/messages/chat', $params);
       /*  $response = curl_exec($curl);

        $err = curl_error($curl); */
       //dd($response.'   '.$err);
      //  curl_close($curl);
   return redirect('order_confirmed');
}


}
