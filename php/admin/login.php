<?php
session_start();

if (isset($_POST['login']) && isset($_POST['pass'])) {

  if ($_POST['login'] == 'admin' && $_POST['pass'] == 'ok') {

    $_SESSION['user'] = 'admin';
    echo 'success';

  } else {

    echo 'wrong';

  }

}