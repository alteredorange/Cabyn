 <html>

<head>

 <script src="http://code.jquery.com/jquery-2.2.0.min.js"></script>
  <!-- Compiled and minified CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css">

  <!-- Compiled and minified JavaScript -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.min.js"></script>
<script src="https://cdn.firebase.com/js/client/2.4.0/firebase.js"></script>
 <link rel="stylesheet" type="text/css" href="../css/test.css">
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
<?php
require_once('../../vendor/autoload.php');


$sucessUrl = "/?status=voted";
$sucessEncoded = urlencode($sucessUrl);

$failUrl = "/?status=failed";
$failEncoded = urlencode($failUrl);

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1); 

$stripe = array(
  "secret_key"      => "sk_test_oxEZyMeYB3K1sERFueWALIBd",
  "publishable_key" => "pk_test_its3tpyzgduY0pREWf3dc1Lk"
);

\Stripe\Stripe::setApiKey($stripe['secret_key']);

$token = $_POST['stripeToken'];
$email = $_POST['stripeEmail'];
$amount = $_POST['voteRightAmount'];
$battle = $_POST['battlee'];

 $customer = \Stripe\Customer::create(array(
    "source"  => $token,
    "email" => $email,
    "description" => "SITAW"
  ));

  try {
$charge = \Stripe\Charge::create(array(
  "amount" => $amount * 100, // amount in cents, again
  "currency" => "usd",
  "customer" => $customer->id,
  "description" => $battle
  ));

  $success=1;

} catch(\Stripe\Error\Card $e) {
  $error = $e->getMessage();
}

if ($success=1)
{


?>


 <script>

var battleName = "<?php echo $battle; ?>";

var onComplete = function(error) {
  if (error) {
    console.log('Synchronization failed');
     window.location.replace('<?php echo urldecode($sucessEncoded); ?>');
  } else {
    console.log('Synchronization succeeded');
    // $(location).attr('href', '<?php echo urldecode($sucessEncoded); ?>');

    window.location.replace('<?php echo urldecode($sucessEncoded); ?>');
     
  }
};


var totalVotes = new Firebase('https://mwymi.firebaseio.com/Battles/'+battleName+'/totalRightVotes');

            totalVotes.transaction(function (current_value) {
                      return (current_value || 0) + <?php echo $amount ?>;
                      }, onComplete);



var voters = new Firebase('https://mwymi.firebaseio.com/Battles/'+battleName+'/Voters');
voters.push({
                      email: "<?php echo $email ?>",
                      votes: <?php echo $amount ?>,
                      side: "Right"
                                   }, onComplete);


 // window.location.href = '<?php echo urldecode($sucessEncoded); ?>';

 </script>



<?php

/*
header("Location: " . urldecode($sucessEncoded));    Redirect browser  
 exit();
*/

} else {
  header("Location: " . urldecode($Encoded)); /* Redirect browser */
exit();
}

?>



</head>
<body>

 <h1 class="customfont text-center" style="margin-top:10%">VOTING...</h1>
 <div class="progress" style="top:20%">
      <div class="indeterminate"></div>
  </div>


</body>
</html>