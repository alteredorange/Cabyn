<?php
require_once('../../vendor/autoload.php');

$stripe = array(
  "secret_key"      => "sk_test_oxEZyMeYB3K1sERFueWALIBd",
  "publishable_key" => "pk_test_its3tpyzgduY0pREWf3dc1Lk"
);

\Stripe\Stripe::setApiKey($stripe['secret_key']);
?>