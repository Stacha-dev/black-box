<?php
session_start();

$og = OgImage::getUrl();
$lang = 'cs';

echo '
<!doctype html>
<html lang="'.$_SESSION['lang'].'">
  <head>
    <meta charset="utf-8">

    <title>BLACK BOX</title>
    <meta name="keywords" content="black box, černá skříňka, umění, kultura">
    <meta name="description" content="Černá skříňka artu korony">

    <meta name="robots" content="all">
    <meta name="author" content="Jana Horáková — Teorietická koncepce, Marika Kupková — Kurátorka, Oliver Staša — Developer, Alina Matějová — Grafická koncepce a design">
    <meta name="viewport" content="width=device-width">

    <link rel="icon" href="/data/fav.png">
    <link href="/css/main.css?v=0.1" rel="stylesheet">

    <script src="/js/jq.js" type="text/javascript"></script>
    <script src="/js/fce.js?v=0.1" type="module"></script>

    <meta property="og:image" content="'.$og.'">

  </head>
<body>
</body>
</html>';
