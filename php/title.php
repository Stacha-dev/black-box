<?php

  if (isset($_POST['title'])) {

    $title = $_POST['title'];

      if ($title == '/') {

        echo '';

      } else {

        echo 'TITLE';

      }

  }
