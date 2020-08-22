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
$cmd = escapeshellcmd('nice -20 ../../python/env/bin/python ../../python/cluster.py');
$output = shell_exec($cmd);



/*
dekoduje json
*/
$json = json_decode($output, true);
if ($json['success'] == true) {

  $status = 'success';


} else {

  $status = 'ERROR';

}


}



/*
OUTPUT
*/
echo '
{
  "headder": "clustersExe",
  "result": "'.$output.'";
  "status": "'.$status.'"
}
';

}
