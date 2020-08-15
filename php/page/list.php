<?php

$name = array("RUDOLF ROSOMÁK", "ZORA PODLENOVÁ", "MAGDALENA ZAKNIAJKTELKO", "SEVERÍN DUŠEK", "MARTIN KONVIČKA", "KARLA MATĚJOVÁ", "PETR LAHODA", "KAIKA NOIKA");
$imgs = array("/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg");
$keywords = array("obrázek", "fotografie", "screenshot", "nahrávka", "malba", "osobní materiál", "dokumentace");

$images = '';
for ($i = 0; $i < sizeof($imgs); $i++) {
  $images .= '"'.$imgs[$i].'"';
  if ($i != sizeof($imgs)-1) {
    $images .= ',';
  }
}

$html = '';

$html .= '<div id=\\"list\\"><div id=\\"seznam\\" class=\\"grabber\\"><table><tr class=\\"search\\"><td><input type=\\"text\\" id=\\"filterName\\" placeholder=\\"JMÉNO\\"></td><td><input type=\\"text\\" id=\\"filterMaterial\\" placeholder=\\"MATERIÁL\\"></td></tr>';

  for ($r = 0; $r < 40; $r++) {
    $popis = $keywords[rand(0, sizeof($keywords)-1)];
    $html .= '<tr thumb=\\"'.$imgs[rand(0, sizeof($imgs)-1)].'\\"><td>'.str_replace(" ", "&nbsp;", $name[rand(0, sizeof($name)-1)]).'</td><td>'.$popis.'</td></tr>';
  }

$html .= '</table></div></div>';

echo '
{
  "headder": "list",
  "html": "'.$html.'"
}
';


/*
,
"imgs": ['.$images.']

*/
