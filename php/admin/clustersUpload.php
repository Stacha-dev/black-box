<?php
session_start();
if ($_SESSION['user'] == 'admin') {



/*
DB SETUP
*/
include '../sql.php';
$conn = sql();



/*
fuknce pro testovani linku
*/
include '../fce.php';



/*
values
*/
$status = 'default';



/*
ulozi vysledek clusteru do db
*/
    if (isset($_POST['data'])) {


        // prida to do databaze
        $sql = 'INSERT INTO clusters(clusters) VALUES ("'.$_POST['data'].'")';
        if ($conn->query($sql)) {

          $status = 'success';

        // pokud chyba db, smaze ten upload
        } else {

          $status = 'db insert error';

        }


    } else {

      $status = 'bad post inputs';

    }



}



/*
OUTPUT
*/
echo '
{
  "headder": "clustersUpload",
  "status": "'.$status.'"
}
';

}
