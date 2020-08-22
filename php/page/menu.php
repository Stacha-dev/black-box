<?php
/*
FUNKCE
*/
include '../fce.php';



?>

<div id="kuratori">
  <div class="kurator<?php if ($_SESSION['kurator'] == 'k1') {echo ' selected';} ?>" id="k1"><span><?php echo lang('KURÁTOR 1', 'CURATOR 1'); ?></span></div>
  <div class="kurator<?php if ($_SESSION['kurator'] == 'k2') {echo ' selected';} ?>" id="k2"><span><?php echo lang('KURÁTOR 2', 'CURATOR 2'); ?></span></div>
</div>

<div id="texty">
  <div class="text" id="t1">
    <div class="title"><span><?php echo lang('O PROJEKTU', 'ABOUT PROJECT'); ?></span><div class="blinder"></div><div class="closeMenu"></div></div>
  </div>
  <div class="text" id="t2">
    <div class="title"><span><?php echo lang('KURÁTOŘI', 'CURATORS'); ?></span><div class="blinder"></div><div class="closeMenu"></div></div>
  </div>
  <div class="text" id="t3">
    <div class="title"><span><?php echo lang('TEORIE', 'THEORY'); ?></span><div class="blinder"></div><div class="closeMenu"></div></div>
  </div>
</div>
