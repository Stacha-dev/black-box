<?php
session_start();
if ($_SESSION['user'] == 'admin') {


/*
php.ini SET
*/
ini_set('upload_max_filesize', '99MB');
ini_set('max_file_uploads', '25');
ini_set('post_max_size', '99MB');
ini_set('max_execution_time', '120');


/*
DB SETUP
*/
include '../sql.php';
$conn = sql();


$id = isset($_GET['id'])?$_GET['id']:false;
$data = false;
$status = 'default';


/*
fce setup
*/
function randNazev() {
    $rand = false;
    $ch = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for ($i = 0; $i < 8; $i++) {
        $in = rand(0, strlen($ch) - 1);
        $rand .= $ch[$in];
    }
    return $rand;
}


/*
resize
*/
function resizeImg($file, $dest, $w, $h) {

    list($width, $height) = getimagesize($file);

      $r = $width/$height;

      if ($w/$h > $r) {
          $newwidth = $h*$r;
          $newheight = $h;
      } else {
          $newheight = $w/$r;
          $newwidth = $w;
      }

    // pokud se obrazek nezvetsuje po prepoctu, zmensi ho
    if ($newwidth < $width && $newheight < $height) {

      $src = imagecreatefromjpeg($file);
      $new = imagecreatetruecolor($newwidth, $newheight);
      imagecopyresampled($new, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

      return imagejpeg($new, $dest);

    // pokud by se zvetsoval, proste ho jen uploadne v soucasnem stavu
    } else {

      return move_uploaded_file($file, $dest);

    }

}


/*
upload souboru
*/
if ($id && isset($_FILES['files']) && !empty($_FILES['files'])) {

    $pocet = count($_FILES["files"]['name']);

    // projde a uploadne je po jednom souboru
    for ($i = 0; $i < $pocet; $i++) {

        if ($_FILES["files"]["error"][$i] > 0) {

            $status = 'file error: '.$_FILES["files"]["error"][$i];

        // upload souboru
        } else {

            // vytvori nove jmeno souboru
            $newName = false;
            while (file_exists('../../data/projects/'.$newName.'.jpg') || !$newName) {
              $newName = randNazev();
            }

            // uploadne ho a jestli se to podari...
            $adresa = '../../data/projects/'.$newName.'.jpg';

            if (resizeImg($_FILES["files"]["tmp_name"][$i], $adresa, 2048, 2048)) {

              // ...prida ho do databaze
              $sql = 'INSERT INTO projectdata(pid, filename) VALUES ("'.$id.'", "'.$newName.'")';
              if ($conn->query($sql)) {

                $data = $newName;
                $status = 'success';
                $dataId = $conn->insert_id;

              // pokud chyba db, smaze ten upload
              } else {
                unlink($adresa);
                $status = 'db error';
              }

            // pokud upload chyba...
            } else {
              $status = 'upload error';
            }

        }

    }

} else {

  $status = 'bad post inputs';

}

echo '
{
  "headder": "upload",
  "status": "'.$status.'",
  "data": "'.$data.'",
  "dataId": "'.$dataId.'",
  "id": "'.$id.'"
}
';

}
