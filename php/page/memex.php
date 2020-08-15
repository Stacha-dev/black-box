<?php
session_start();
if (isset($_SESSION['kurator'])) {
  
}

  $keywords = array("pavel", "lukas", "radek", "petr", "lucka", "dana", "marie", "karla", "honza", "ellen", "elsa", "emanuel", "elektra");
  $name = array("RUDOLF ROSOMÁK", "ZORA PODLENOVÁ", "MAGDALENA ZAKNIAJKTELKO", "SEVERÍN DUŠEK", "MARTIN KONVIČKA", "KARLA MATĚJOVÁ", "PETR LAHODA", "KAIKA NOIKA");
  $imgs = array("/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg");

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

    $img = '<img src=\\"/data/raziel.jpg\\" class=\\"mainPic\\">';
    $imgSK = array('<img class=\\"sidekick\\" src=\\"/data/mbr.png\\">', '<img class=\\"sidekick\\" src=\\"/data/up.png\\">', '<img class=\\"sidekick\\" src=\\"/data/alina.png\\">');

    $img = $img.$imgSK[rand(0, sizeof($imgSK)-1)].$imgSK[rand(0, sizeof($imgSK)-1)];
    $nm = $name[rand(0, sizeof($name)-1)];

    $html .= '<div class=\\"prj\\" tags=\\"'.$randk.'\\" id=\\"prj'.$i.'\\">'.$img.'<div class=\\"title\\"><a href=\\"/prj/linktoprj'.$i.'\\" title=\\"==> '.$i.':: '.$randk.'\\">'.$nm.'</a></div></div>';

  }

  echo '
  {
    "headder": "memex",
    "html": "'.$html.'",
    "imgs": ['.$images.']
  }
  ';
