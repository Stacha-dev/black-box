<?php
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}



/*
DB connect
*/
include './php/sql.php';
$conn = sql();



/*
fce include
*/
include './php/fce.php';



/*
get OG and TITLE
*/
$og = og($conn);
$title = titulek($_SERVER['REQUEST_URI'], $conn);



/*
layout
*/
echo '
<!doctype html>
<html lang="'.$_SESSION['lang'].'">
  <head>
    <meta charset="utf-8">

    <title>'.$title.'</title>
    <meta name="keywords" content="black box, černá skříňka, umění, kultura">
    <meta name="description" content="Welcome to the website presenting a double curatorial project that was created when there was no place for the art on the Earth.">

    <meta name="robots" content="all">
    <meta name="author" content="Jana Horáková — Teorietická koncepce, Marika Kupková — Kurátorka, Oliver Staša — Developer, Alina Matějová — Grafická koncepce a design">
    <meta name="viewport" content="width=device-width">

    <link rel="icon" href="/data/fav.png">
    <link href="/css/main.css?v=1.00launch" rel="stylesheet">

    <script src="/js/jq.js" type="text/javascript"></script>
    <script src="/js/fce.js?v=1.00launch" type="module"></script>

    <meta property="og:image" content="'.$og.'">

  </head>
<body>
</body>
</html>';
