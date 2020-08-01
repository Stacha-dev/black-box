<?php

if ($_POST['prjId']) {

  $imgs = array("/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/raziel.jpg", "/data/raziel.jpg", "/data/raziel.jpg", "/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/alina.png", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/mbr.png", "/data/up.png", "/data/raziel.jpg", "/data/raziel.jpg", "/data/raziel.jpg", "/data/raziel.jpg");

  $imgsCount = rand(1, sizeof($imgs));

  $images = '';
  $vyobrazeni = '';
  for ($i = 0; $i < $imgsCount; $i++) {
    $images .= '"'.$imgs[$i].'"';
    if ($i != $imgsCount-1) {
      $images .= ',';
    }
    $vyobrazeni .= '<li post=\\"'.($i+1).'\\">'.($i+1).'. '.str_replace("/data/", "", $imgs[$i]).'</li>';
  }

  $vyobrazeni .= '<li post=\\"postMain\\">'.($i+1).'. HLAVNI FOTO</li>';

  // poradi ve kterem se vygeneruji odpovida tomu kdy budou animovany ==> prvni vygeneovany = prvni animovany
  $html .= '<div style=\\"z-index: 2;\\" class=\\"post moveable info\\" id=\\"vyobrazeni\\"><div class=\\"title\\"><div class=\\"name\\">SEZNAM VYOBRAZENÍ</div><div class=\\"moreInfo\\">↓</div></div><div class=\\"content\\">'.$vyobrazeni.'</div></div>';
  $html .= '<div style=\\"z-index: 3;\\" class=\\"post moveable info\\" id=\\"info\\"><div class=\\"title\\"><div class=\\"name\\">'.$_POST['prjId'].'</div><div class=\\"moreInfo\\">↓</div></div><div class=\\"content\\">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Praesent dapibus. Nullam sapien sem, ornare ac, nonummy non, lobortis a enim. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Etiam egestas wisi a erat. Morbi scelerisque luctus velit. Morbi leo mi, nonummy eget tristique non, rhoncus non leo. Mauris metus. Fusce consectetuer risus a nunc. Curabitur ligula sapien, pulvinar a vestibulum quis, facilisis vel sapien. Pellentesque sapien. Aliquam ante. Curabitur ligula sapien, pulvinar a vestibulum quis, facilisis vel sapien. Aliquam id dolor. Nunc tincidunt ante vitae massa. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin sem purus in lacus. Fusce tellus odio, dapibus id fermentum quis, suscipit id erat.</div></div>';

  for ($i = 0; $i < $imgsCount; $i++) {

    $html .= '<div class=\\"post moveable\\" id=\\"post'.($i+1).'\\"><img src=\\"'.$imgs[$i].'\\"><div class=\\"num\\">'.($i+1).'.</div><div class=\\"bigPost\\">⇲</div></div>';

  }

  // musi byt posledni ==> posledni animuje
  $html .= '<div style=\\"z-index: 4;\\" class=\\"post moveable large\\" id=\\"postMain\\"><img src=\\"/data/raziel.jpg\\"><div class=\\"num\\">'.($i+1).'.</div><div class=\\"bigPost\\">⇲</div></div>';

  echo '
  {
    "headder": "blackbox",
    "html": "<div id=\\"blackbox\\">'.$html.'</div>",
    "imgs": ['.$images.']
  }
  ';

}
