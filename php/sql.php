<?php
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}
/*
MySQL
*/
function sql() {

  if ($_SESSION['user'] == 'admin') {

    $server = "localhost";
    $login = "c4blackbox";
    $pass = "txKe!2e8RzQR";
    $db = "c4blackbox";

    $conn = new mysqli($server, $login, $pass, $db);

    if ($conn->connect_error) {
      return false;
    } else {
      return $conn;
    }

  }

}
