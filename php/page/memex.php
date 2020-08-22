<?php
session_start();
if (isset($_SESSION['kurator'])) {

}



/*
DB SETUP
*/
include '../sql.php';
$conn = sql();



/*
FUNKCE
*/
include '../fce.php';



// zakladni promenne
$imgpreload = array();
$imgset = '';
$html = '';



// vypise vsecky projekty
$sql = 'SELECT id, name, '.lang('keywords', 'keywords_en').' AS keywords, link, (SELECT filename FROM projectdata WHERE pid = projects.id AND main = 1) AS mainpic FROM projects WHERE active = "1"';
if ($ress = $conn->query($sql)) {
    while($prj = $ress->fetch_object()){

      // hlavni fotka
      $imgset = '<img src=\\"/data/projects/'.$prj->mainpic.'.jpg\\" class=\\"mainPic\\">';
      array_push($imgpreload, '"/data/projects/'.$prj->mainpic.'.jpg"');

      // obrazky
      $imgs = 'SELECT filename FROM projectdata WHERE pid = "'.$prj->id.'" AND display = "1" AND filename <> "'.$prj->mainpic.'" ORDER BY RAND() LIMIT 2';
      $img = $conn->query($imgs);
        while($thumb = $img->fetch_object()){
          $imgset .= '<img src=\\"/data/projects/'.$thumb->filename.'.jpg\\" class=\\"sidekick\\">';
          array_push($imgpreload, '"/data/projects/'.$thumb->filename.'.jpg"');
        }

      // nacpe do html
      $html .= '<div class=\\"prj\\" tags=\\"'.preg_replace('/\s*,\s*/', ',', $prj->keywords).'\\" id=\\"prj'.$prj->link.'\\">'.$imgset.'<div class=\\"title\\"><a href=\\"/prj/'.$prj->link.'\\">'.$prj->name.'</a></div></div>';

    }
}



// OUTPUT json
echo '
{
  "headder": "memex",
  "html": "'.$html.'",
  "imgs": ['.join(',', $imgpreload).']
}
';
