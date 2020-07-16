<?php

  $keywords = array("pavel", "lukas", "radek", "petr", "lucka", "dana", "marie", "karla");

  $html = '';
  for ($i = 0; $i < 6; $i++) {

    $randk = '';
    for ($k = 0; $k < rand(2, 6); $k++) {
      $randk .= $keywords[rand(0, sizeof($keywords)-1)].',';
    }
    $randk = substr($randk, 0, -1);
    $html .= '<div class=\\"prj fadeout\\" tags=\\"'.$randk.'\\" id=\\"prj'.$i.'\\">'.$randk.'</div>';

  }

  echo '
  {
    "headder": "memex",
    "html": "'.$html.'"
  }
  ';

  // <a href=\\"/memex\\">memex</a>
