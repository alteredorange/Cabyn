 <script src="http://code.jquery.com/jquery-2.2.0.min.js"></script>
<script src="https://cdn.firebase.com/js/client/2.4.0/firebase.js"></script>

<?php


require_once('../../vendor/autoload.php');


$stripe = array(
  "secret_key"      => "sk_test_oxEZyMeYB3K1sERFueWALIBd",
  "publishable_key" => "pk_test_its3tpyzgduY0pREWf3dc1Lk"
);

\Stripe\Stripe::setApiKey($stripe['secret_key']);

// Get the credit card details submitted by the form
$token = $_POST['stripeToken'];
$email = $_POST['stripeEmail'];
$amount = $_POST['voteRightAmount'];
$battle = $_POST['battle'];

// Create the charge on Stripe's servers - this will charge the user's card
try {
$charge = Stripe_Charge::create(array(
  "amount" => 2000, // amount in cents, again
  "currency" => "usd",
  "card" => $token,
  "description" => "payinguser@example.com")
);
echo 'success';
} catch(Stripe_CardError $e) {
  // The card has been declined
    echo $tokenid;
}

?>