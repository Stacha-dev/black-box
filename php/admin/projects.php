<?php
session_start();
if ($_SESSION['user'] == 'admin') {

/*
DB SETUP
*/
include '../sql.php';
$conn = sql();



/*
fuknce pro testovani linku
*/
// testne v sql ten link a vrati true/false
function sqlLink($link, $conn) {

  $sql = 'SELECT COUNT(*) AS pocet FROM projects WHERE link = "'.$link.'"';
  $ress = $conn->query($sql);
  $obj = $ress->fetch_object();
  if (!$obj->pocet) {
    return true;
  } else {
    return false;
  }

}
// prevede text na link
function testForLink($name, $conn) {

  // zakladni prepis
  $najdi = array('ě', 'š', 'č', 'ř', 'ž', 'ý', 'á', 'í', 'é', 'ď', 'ť', 'ň', "'", '"', ' ');
  $vymen = array('e', 's', 'c', 'r', 'z', 'y', 'a', 'i', 'e', 'd', 't', 'n', '',  '',  '-');

  $link = strtolower($name);
  $link = str_replace($najdi, $vymen, $link);
  $link = iconv('UTF-8', 'ISO-8859-1//TRANSLIT//IGNORE', $link);
  $link = preg_replace('/[^A-Za-z0-9\-]/', '', $link);
  $link = preg_replace('/-+/', '-', $link);
  $link .= '-'.date('Y');

  $pass = 0;
  $testLink = $link;

  // cyklus testu
  while (!sqlLink($testLink, $conn)) {

    if ($pass > 0) {
      $testLink = $link.'_'.$pass;
    }

    $pass++;

  }

  return $testLink;

}



/*
main funkce
*/
$id = false;
$status = 'default';
$html = '<div class=\\"admin\\"><h1>PROJEKTY</h1><br>';

// pokud sme pripojeni k DB
if ($conn) {

  // pokud je setnuta akce
  if (isset($_POST['action'])) {

    $html .= '<ul><li><a href=\\"/admin\\">administrace</a></li><li><a href=\\"/admin/projects\\">projekty</a></li></ul>';

    // jaka akce je setnuta
    switch ($_POST['action']) {

      // pridat projekt
      case 'add':

        // pokud JS vola soubor pro exekuci SQL
        if (isset($_POST['sql']) && $_POST['sql'] == true) {

          // vytvori link = odstrani specialni znaky
          $link = testForLink($_POST['name'], $conn);

          // vlozi do db
          $sql = 'INSERT INTO projects(name, link) VALUES ("'.$_POST['name'].'", "'.$link.'")';
          if ($conn->query($sql)) {
            $status = 'success';
            $id = $conn->insert_id;
          } else {
            $status = 'db error';
          }

        // pokud ne a chceme jen videt menu
        } else {

          $html .= '<br><h2>PŘIDAT PROJEKT</h2><br>';
          $html .= '<form method=\\"post\\" class=\\"adminForm\\" table=\\"projects\\" act=\\"add\\">';
          $html .= '<input type=\\"text\\" name=\\"autor\\" placeholder=\\"JMÉNO AUTORA\\">';
          $html .= '<input type=\\"submit\\" name=\\"submit\\" value=\\"PŘIDAT\\">';
          $html .= '</form>';

        }

      break;

      // upravit projekt
      case 'edit':

          // odeslany form s datama => ulozit do DB
          if (isset($_POST['sql']) && $_POST['sql'] == true) {

            // jestli se zmenilo jmeno, zmen link
            $sql = 'SELECT name FROM projects WHERE id = "'.$_POST['id'].'"';
            $ress = $conn->query($sql);
            $obj = $ress->fetch_object();
            if ($obj->name != $_POST['name']) {
              $link = testForLink($_POST['name'], $conn);
              $newLink = ' link = "'.$link.'",';
            } else {
              $newLink = '';
            }

            // upravit projekt v DB
            $sql = 'UPDATE projects SET name = "'.$_POST['name'].'",'.$newLink.' info = "'.$_POST['info'].'", keywords = "'.$_POST['keywords'].'", active = "'.$_POST['active'].'" WHERE id = "'.$_POST['id'].'"';
            if ($conn->query($sql)) {
              $status = 'success';
              $id = $_POST['id'];
            } else {
              $status = 'db error';
            }

          // vypise formular k editaci
          } else if (isset($_POST['id'])) {

            // vytvorit form pro edit
            $sql = 'SELECT id, name, link, info, keywords, active FROM projects WHERE id = "'.$_POST['id'].'"';
            if ($ress = $conn->query($sql)) {
                $obj = $ress->fetch_object();

                    $active = $obj->active?' checked':'';

                    $html .= '<br><h2>🖿 PROJEKT <span id=\\"nazevProjektu\\">'.$obj->name.'</span></h2><br>';
                    $html .= '<form method=\\"post\\" class=\\"adminForm\\" table=\\"projects\\" act=\\"edit\\" idkey=\\"'.$_POST['id'].'\\">';
                    $html .= '<ul>';
                    $html .= '<li><a href=\\"/prj/'.$obj->link.'\\">[otevřít projekt] prj/'.$obj->link.'</a></li>';
                    $html .= '<li><a href=\\"/admin/data/show/'.$obj->id.'\\">zobrazit data projektu</a></li>';
                    $html .= '<li><a href=\\"/admin/data/add/'.$obj->id.'\\">přidat data projektu</a></li><br>';
                    $html .= '<h3>JMÉNO AUTORA</h3>';
                    $html .= '<li><input type=\\"text\\" name=\\"autor\\" value=\\"'.$obj->name.'\\" placeholder=\\"JMÉNO AUTORA\\"></li>';
                    $html .= '<h3>INFORMACE</h3>';
                    $html .= '<li><textarea name=\\"info\\" placeholder=\\"INFORMACE\\">'.$obj->info.'</textarea></li>';
                    $html .= '<h3>KLÍČOVÉ SLOVA</h3>';
                    $html .= '<li><textarea name=\\"keywords\\" placeholder=\\"KLÍČOVÉ SLOVA\\">'.$obj->keywords.'</textarea><br><i>*oddělit čárkou</i></li>';
                    $html .= '<h3>NASTAVENÍ</h3>';
                    $html .= '<li>PUBLIKOVAT <input type=\\"checkbox\\" name=\\"active\\"'.$active.'></li>';
                    $html .= '<br><br>';
                    $html .= '<li><input type=\\"submit\\" name=\\"submit\\" value=\\"ULOŽIT\\"></li>';
                    $html .= '<br><br>';
                    $html .= '<h3>Danger zone</h3><br>';
                    $html .= '<li id=\\"prompt\\">Opravdu smazat projekt *'.$obj->name.'* včetně všech dat patřících tomuto projektu?<br><br><a href=\\"/admin/projects/delete/'.$obj->id.'\\" class=\\"deleteThis\\">ano, odstranit celý projekt</a> / <span class=\\"togglePrompt\\">zachovat projekt</span></li><br>';
                    $html .= '<li><span class=\\"deleteThis togglePrompt\\">smazat projekt</span></li>';
                    $html .= '</ul>';
                    $html .= '</form>';

            }

          } else {

            $html .= '<h1>CHYBÍ ID</h1>';

          }

      break;

      // smazat projekt
      case 'delete':

          if (isset($_POST['id'])) {

            // smazat vsechny fotky ze serveru
            $sql = 'SELECT filename FROM projectdata WHERE pid = "'.$_POST['id'].'"';
            if ($ress = $conn->query($sql)) {
              while($obj = $ress->fetch_object()){

                $filename = $obj->filename.'.jpg';
                chmod('../../data/projects/'.$filename, 0777);
                if (!unlink('../../data/projects/'.$filename)) {
                  $html .= '<br><h2>CHYBA, "'.$filename.'" NESMAZÁNO</h2>';
                }

              }

              // smazat vse z SQL
              $sql = 'DELETE FROM projects WHERE id = '.$_POST['id'].';';
              $sql .= 'DELETE FROM projectdata WHERE pid = '.$_POST['id'].';';
              if ($conn->multi_query($sql)) {
                $html .= '<br><h2>SMAZÁNO</h2><br><ul><li><a href=\\"/admin/projects\\">výpis projektů</a></li></ul>';
              } else {
                $html .= '<br><h2>CHYBA, NESMAZÁNO z DB</h2>';
              }

            } else {

                $html .= '<br><h2>NEJEDE DB</h2>';

            }

          } else {

            $html .= '<br><h2>CHYBÍ ID</h2>';

          }

      break;

    }

  // pokud neni setnuta zadna akce, defaultne se vypisou projekty
  } else {

    $html .= '<ul><li><a href=\\"/admin\\">administrace</a></li><li><a href=\\"/admin/projects/add\\">přidat projekt</a></li></ul>';

        // vypsat projekty co tam sou
        $sql = 'SELECT * FROM projects';
        if ($ress = $conn->query($sql)) {

            $html .= '<br><h2>SEZNAM PROJEKTŮ</h2><br>';
            $html .= '<table class=\\"adminTable\\"><tr><td>ID</td><td>AUTOR</td><td>STAV</td><td>OPEN</td></tr>';
            while($obj = $ress->fetch_object()){
                $html .= '<tr><td>'.$obj->id.'</td><td>'.$obj->name.'</td><td>'.($obj->active?'PUBLIKOVÁNO':'SKRYTO').'</td><td align=\\"center\\"><a href=\\"/admin/projects/edit/'.$obj->id.'\\"><strong>🖿</strong></a></td></tr>';
            }
            $html .= '</table>';
        }

  }

// nejede SQL
} else {

  $html .= '<h1>ERROR DATABÁZE</h1>';

}

$html .= '<br></div>';

// neni admin
} else {

  $html .= '<div class=\\"admin\\"><h1>PROJEKTY</h1><br>Nejste přihlášen/a, <a href=\\"/admin\\">přihlásit</a>.</div>';

}




/* JSON */
echo '
{
  "headder": "admin",
  "html": "'.$html.'",
  "status": "'.$status.'",
  "id": "'.$id.'"
}
';
