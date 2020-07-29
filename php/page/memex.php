<?php

  $keywords = array("pavel", "lukas", "radek", "petr", "lucka", "dana", "marie", "karla", "honza", "ellen", "elsa", "emanuel", "elektra");
  $name = array("Rudolf Rosomák", "Zora Podlenová", "Magdalena Zakniajktelko", "Severín Dušek", "Martin Konvička", "Karla Matějová");
  $imgs = array("/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg");

  $images = '';
  for ($i = 0; $i < sizeof($imgs); $i++) {
    $images .= '"'.$imgs[$i].'"';
    if ($i != sizeof($imgs)-1) {
      $images .= ',';
    }
  }

  $html = '';
  for ($i = 0; $i < 8; $i++) {

    $randk = '';
    for ($k = 0; $k < rand(0, 5); $k++) {
      $randk .= $keywords[rand(0, sizeof($keywords)-1)].',';
    }
    $randk = substr($randk, 0, -1);

    $img = '<img src=\\"/data/raziel.jpg\\">';
    $imgSK = array('<img class=\\"sidekick fadeout\\" src=\\"/data/mbr.png\\">', '<img class=\\"sidekick fadeout\\" src=\\"/data/up.png\\">', '<img class=\\"sidekick fadeout\\" src=\\"/data/alina.png\\">');

    $img = $img.$imgSK[rand(0, sizeof($imgSK)-1)].$imgSK[rand(0, sizeof($imgSK)-1)];
    $nm = $name[rand(0, sizeof($name)-1)];

    $html .= '<div class=\\"prj fadeout\\" tags=\\"'.$randk.'\\" id=\\"prj'.$i.'\\">'.$img.'<div class=\\"title\\"><a href=\\"/prj/linktoprj'.$i.'\\" title=\\"==> '.$i.':: '.$randk.'\\">'.$nm.'</a></div></div>';

  }

  echo '
  {
    "headder": "memex",
    "html": "'.$html.'",
    "imgs": ['.$images.']
  }
  ';

  // <a href=\\"/memex\\">memex</a>
