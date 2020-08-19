<?php
if (isset($_POST['prjId'])) {



/*
DB SETUP
*/
include '../sql.php';
$conn = sql();



// zakladni promenne
$imgpreload = array();
$vyobrazeni = '';
$imgset = '';
$html = '';



// vypise vsecky projekty
$sql = 'SELECT id, name, info, keywords, link FROM projects WHERE link = "'.$_POST['prjId'].'" AND active = 1';
if ($ress = $conn->query($sql)) {
    $prj = $ress->fetch_object();

      // obrazky a vyobrazeni
      $post = 1;
      $imgs = 'SELECT filename, description FROM projectdata WHERE pid = "'.$prj->id.'" AND display = "1" ORDER BY main DESC, RAND()';
      $img = $conn->query($imgs);
        while($thumb = $img->fetch_object()){
          // nachysta div
          $pic = '<div class=\\"post moveable'.(($post == 1)?' large\\" style=\\"z-index: 4;':'').'\\" id=\\"post'.$post.'\\"><img src=\\"/data/projects/'.$thumb->filename.'.jpg\\"><div class=\\"num\\">'.$post.'.</div><div class=\\"bigPost\\"></div></div>';
          // schova prvni fotku na konec, zbytek nacpe do html
          if ($post == 1) {
            $mainPic = $pic;
          } else {
            $html .= $pic;
          }
          // vygeneruje vyobrazeni do seznamu
          $vyobrazeni .= '<li>'.$post.'. '.$thumb->description.' <span class=\\"locate\\" post=\\"'.$post.'\\"></span></li>';
          array_push($imgpreload, '"/data/projects/'.$thumb->filename.'.jpg"');
          $post++;
        }

      // klicove slova
      $keywords = '['.preg_replace('/\s*,\s*/', '], [', $prj->keywords).']';

      // pricpe do html seznam vyobrazeni a info o projektu
      $html .= '<div style=\\"z-index: 2;\\" class=\\"post moveable info\\" id=\\"vyobrazeni\\"><div class=\\"title\\"><div class=\\"name\\">SEZNAM VYOBRAZENÍ</div><div class=\\"moreInfo\\"></div></div><div class=\\"content\\">'.$vyobrazeni.'</div></div>';
      $html .= '<div style=\\"z-index: 3;\\" class=\\"post moveable info\\" id=\\"info\\"><div class=\\"title\\"><div class=\\"name\\">'.$prj->name.'</div><div class=\\"moreInfo\\"></div></div><div class=\\"content\\">'.$prj->info.'<p>'.$keywords.'</p></div></div>';

      $html .= $mainPic;

}



// OUTPUT json
echo '
{
  "headder": "blackbox",
  "html": "<div id=\\"blackbox\\">'.$html.'</div>",
  "imgs": ['.join(',', $imgpreload).']
}
';



}
