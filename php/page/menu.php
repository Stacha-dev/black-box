<?php
session_start();
?>

<div id="kuratori">
  <div class="kurator<?php if ($_SESSION['kurator'] == 'k1') {echo ' selected';} ?>" id="k1"><span>KURÁTOR 1</span></div>
  <div class="kurator<?php if ($_SESSION['kurator'] == 'k2') {echo ' selected';} ?>" id="k2"><span>KURÁTOR 2</span></div>
</div>

<div id="texty">
  <div class="text" id="t1">
    <div class="title"><span>O PROJEKTU</span><div class="blinder"></div><div class="closeMenu"></div></div>
  </div>
  <div class="text" id="t2">
    <div class="title"><span>KURÁTOŘI</span><div class="blinder"></div><div class="closeMenu"></div></div>
  </div>
  <div class="text" id="t3">
    <div class="title"><span>TEORIE</span><div class="blinder"></div><div class="closeMenu"></div></div>
  </div>
</div>
