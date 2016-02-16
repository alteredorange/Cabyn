<?php

include('./MailChimp.php');
use \DrewM\MailChimp\MailChimp;
 $MailChimp = new MailChimp('ff3628bee8e2787a4078819e06510314-us12'); // put your API key here
 $list_id = 'c3541c0282'; // put your list ID here

$email = $_POST['email'];
$subscriber_hash = $MailChimp->subscriberHash($email);

 $result = $MailChimp->post("lists/$list_id/members", [
                'email_address' => $_POST['email'],
                'status'        => $_POST['status'],
              'merge_fields' => ['FNAME'=>$_POST['fname'], 'BETA'=>'Yes']
            ]);

$result = $MailChimp->patch("lists/$list_id/members/$subscriber_hash", [
                'merge_fields' => ['FNAME'=>$_POST['fname']]
            ]);


// //fill in these values for with your own information
// $api_key = 'ff3628bee8e2787a4078819e06510314-us12';
// $datacenter = 'us12';
// $list_id = 'c3541c0282';
// $email = $_POST['email'];
// $status = 'pending';
// if(!empty($_POST['status'])){
//     $status = $_POST['status'];
// }
// $url = 'https://'.$datacenter.'.api.mailchimp.com/3.0/lists/'.$list_id.'/members/';
// $username = 'apikey';
// $password = $api_key;
// $data = array("email_address" => $email,"status" => $status);
// $data_string = json_encode($data);
// $ch = curl_init();
// curl_setopt($ch, CURLOPT_URL,$url);
// curl_setopt($ch, CURLOPT_POST, 1);
// curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
// curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
// curl_setopt($ch, CURLOPT_USERPWD, "$username:$api_key");
// curl_setopt($ch, CURLOPT_HTTPHEADER, array(
//     'Content-Type: application/json',
//     'Content-Length: ' . strlen($data_string))
// );
// $result=curl_exec ($ch);
// curl_close ($ch);
// echo $result;



// include('./mailchimp.php'); 

// $MailChimp = new MailChimp('ff3628bee8e2787a4078819e06510314-us12'); // put your API key here
// $list = 'c3541c0282'; // put your list ID here
// $email = $_POST['email']; // Get email address from form
// $id = md5(strtolower($email)); // Encrypt the email address
// // setup th merge fields
// $mergeFields = array(
//  'FNAME'=>$_POST['displayName'],
// //  '5PURRRFECT' => $_GET['5PURRRFECT'],
// );
// // remove empty merge fields
// $mergeFields = array_filter($mergeFields);
// $result = $MailChimp->put("lists/$list/members/$id", array(
// 'email_address' => $email,
// 'status' => 'subscribed',
// 'merge_fields' => $mergeFields,
// 'update_existing' => true, // YES, update old subscribers!
// ));
// echo json_encode($result);


?>