<?php
session_start();
if ($_SESSION['user'] == 'admin') {



/*
values
*/
$status = 'default';



/*
provede pythnovskou clusterovacku
*/
if (isset($_POST['url'])) {

    // provede pythnovskou clusterovacku
    $cmd = escapeshellcmd('nohup nice -15 env/bin/python cluster.py \'path='.$_POST['url'].'\' 2>&1 &');
    $output = shell_exec($cmd);

    // odstrani nove radky a pak uvozovky
    $output = trim(preg_replace('/\s+/', ' ', $output));
    $output = trim(str_replace('"', '\"', $output));
    $output = trim(str_replace('\'', '"', $output));

    // dekoduje json
    $json = json_decode($output, true);
    if ($json['success'] == "true") {

      $status = 'success';

    } else {

      $status = 'JSON ERROR';

    }


// konec isset $_post
} else {

  $status = 'POST ERROR';

}


}



/*
OUTPUT
*/
echo '
{
  "headder": "clustersExe",
  "result": '.$output.',
  "status": "'.$status.'"
}
';
