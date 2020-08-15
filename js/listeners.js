/*
* event listenery pro akce
* pust si k tomu lady gaga
* premyslim ze si koupim domu plagat
*/

import {page} from './router.js';
import {links} from './memex.js';
import {disableScroll, consoleToggle, menu, menuContent, loading, error} from './router_fce.js';



/*
first to happen after doc is loaded
*/
$(document).ready(function() {

      // loadne obsah podle adresy
      var url = window.location.pathname;
      page(url);
      // priloadne menu s textama
      menu('create');

});



/*
mhm kdyz nekdo zmackne tl. zpet...
*/
$(window).on('popstate', function(e){

      var url = window.location.pathname;
      page(url);
      e.preventDefault();

});



/*
prestavba <a> tagu
*/
$(document).on('click touch', 'a', function(e){

  var link = $(this).attr('href');
  page(link);
  e.preventDefault();

});



/*
prepinac jazyku
*/

$(document).on('click touch', '.langIcon', function(){

    var menuTube = $(this),
        kurator = menuTube.attr('id');

    // provest zmenu v session
    $.get('/php/lang.php', function(res){

      if (res) {
        //log({'lang': res});
        window.location.reload();
      }

    });

});



/*
po kliknuti na projekt v memex(), se triggerne <a> uvnitr .prj divu
*/
$(document).on('click touch', '.prj', function(e){

  $(this).find('a').trigger('click');

  // zavrit bocni menu
  $('.text').removeClass('show');

});



/*
po kliknuti na vyjizdeci polozku v menu
*/
$(document).on('click touch', '#menu .title', function(e){

  var textDiv = $(this).closest('.text');

  // nahrat obsah
  menuContent(textDiv.attr('id'));

});



/*
prepinac kuratora
*/
$(document).on('click touch', '#menu .kurator', function(){

  var menuTube = $(this),
      kurator = menuTube.attr('id');

  // provest zmenu v session
  $.post('/php/kurator.php', {kurator: kurator}, function(res){

    switch (res) {

      // pokud se po kliku kurator zmenil
      case 'changed':
        // reloadne memex
        page('/memex');
        // odznaci minuleho kuratora, oznaci soucacneho
        $('.kurator.selected').removeClass('selected');
        menuTube.addClass('selected');
      break;

      // pokud se kurator po kliku nezmenil
      case 'same':
        // do nothing?
      break;

    }

  });

});



/*
pri zmene velikosti okna je potreba prepocitat pozice pozice linek*
+ ujistit se ze konzole je dole na hlavnim blackbox panelu
* linky se musi prepocitat protoze nejde spocitat width (prepona) v relativnich jednotkach (vh/vw), pouze abs (px)
*/
$(window).on('resize', function(e){

  // pokud vubec linky existuji
  if ($('.line').length) {

    // prepocitat linky
    $('.line').remove();
    links('resize');

  }

  // pokud konzole disabled scroll (neni aktivni), po resizu presune na konec
  var con = $("#console");
  if (con.hasClass('disableScroll')) {
    setTimeout(function(){
      con.stop().animate({scrollTop: con.prop('scrollHeight') - con.innerHeight()}, 500);
    }, 1500);
  }

});



/*
kdyz najdu na titulek vyobrazeni, presune dopredu ten element na ktery najizdim
*/
// event listener k tomu
$(document).on('click', '.info li .locate', function(){

  var li = $(this),
      postId = li.attr('post'),
      post = $('#post'+postId),
      zindex = post.css("z-index") || 0;

      window.zindex++;
      post.css({"z-index": window.zindex});

});



/*
listenery kolem konzole
*/
// event listener na zobrazeni konzole:
// pomoci tlacitka na webu
$(document).on('click touch', '.toggleLog', consoleToggle);



/*
listenery kolem klavesnice
*/
$(document).on('keypress', function(e){

  var ch = e.which || e.keyCode;
  switch(ch) {
  // ";" zapne konzoli
  case 59: case 96:
    consoleToggle();
  break;
  // "1" zapne menu1
  case 49:
    $('#t1 .title').trigger('click');
  break;
  // "2" zapne menu2
  case 50:
    $('#t2 .title').trigger('click');
  break;
  // "3" zapne menu3
  case 51:
    $('#t3 .title').trigger('click');
  break;
  // "M" otevre memex
  case 77:
    $('.memexIcon').last().trigger('click');
  break;
  // "L" otevre memex
  case 76:
    $('.listIcon').last().trigger('click');
  break;
  }

});



/*
event listener na rozkliknuti textu k infu v rozhozenych projektech:
  1. ikonou
  2. dvojklikem
event listener na zvetseni postu v blackboxu:
  3. ikonou
  4. dvojklikem
*/
// 1. ikonou
$(document).on('click touch', '.moreInfo', function(){
  $(this).toggleClass('up').closest('.info').toggleClass('showInfo');
});
// 2. dvojklikem
$(document).on('dblclick', '.info', function(){
  $(this).toggleClass('showInfo').find('.moreInfo').toggleClass('up');
});
// 3. ikonou
$(document).on('click touch', '.bigPost', function(){
  $(this).toggleClass('up').closest('.post').toggleClass('large');
});
// 4. dvojklikem
$(document).on('dblclick', '.post', function(){
  $(this).toggleClass('large').find('.bigPost').toggleClass('up');
});



/*
list
po najeti na polozku v listu
*/
$(document).on('mouseenter', '#list table tr[thumb]', function(e) {

  e.stopPropagation();

  var tr = $(this),
      imageUrl = tr.attr('thumb'),
      paintNew = true,
      pos = {'x': Math.random()*30+10,
             'y': Math.random()*70+15};

  // aby po najeti na radek ten radek byl zvydaznenej, ostatni odvyraznit
  $('#list table tr.selected').removeClass('selected');
  tr.addClass('selected');

  // fadeout na predchozi posty, aby zmizely pokud obsahuji jiny obsah
  var posts = $('.post').not(".goingAway");
  if (posts.length) {

    // kontroluje kazdy .post
    $.each(posts, function(){

      var post = $(this);
      // jestli tam neni shody obrazek
      if (post.find('img').attr('src') != imageUrl) {

        // kdyz neni tak ho fadeoutne a smaze
        post.addClass('goingAway fadeout').delay(500).queue(function(){
          post.remove().dequeue();
        });

      } else {

        paintNew = false;

      }

    });

  }

  // zobrazi novy post (obrazek) vedle seznamu pokud uz neni zobrazeny
  if (paintNew) {

    $('#list').append($('<div>', {class: 'post moveable fadeout', css: {top: pos.y+'vh', left: pos.x+'vw'}})); // .html('<div class="loading t post"></div>')

    // provede preload obrazku a pak ho zobrazi
    var img = new Image();
    img.src = imageUrl;
    img.onload = function() {

      $('.post:last-child').html('<img src="'+imageUrl+'"><div class="bigPost"></div>').removeClass('fadeout');

    };

  }

});



/*
admin login
*/
$(document).on('submit', '#loginFrom', function(e){

  var login = $('input[name="login"]').val(),
      pass = $('input[name="pass"]').val();

  $.post('/php/admin/login.php', {login: login, pass: pass}, function(res){

    if (res == 'success') {
      page('/admin');
    } else {
      error('you stupid');
    }

  });

  e.preventDefault();

});



/*
admin logout
*/
$(document).on('click touch', '.logout', function(){

  $.get('/php/admin/logout.php', function(res){

    if (res == 'success') {
      page('/admin');
    }

  });

});


/*
kdyz najedu na linku tak aby ten title sledoval mys
akorat to nefunguje ani podle meho genialniho nakresu na papire
takze sem se na to v pondeli 3/8/2020 v 17:01 zvysoka vysral
*/

/*
const movingTag = function(e) {

  var line = $('.movingTag'),
      lineTags = line.find('.keys'),
      x1 = line.attr('baseX'),
      x2 = line.attr('baseX2'),
      scrollPos = $('#content').scrollLeft(),
      koef = line.width()/Math.abs(x1-x2);

      if (x1 < x2) {
        var xBase = x1;
      } else {
        var xBase = x2;
      }

  lineTags.css({marginLeft: (e.pageX - (xBase-scrollPos) * 1)});

};
const movingTagOut = function() {

    $('.line').removeClass('movingTag');

      $(document).off('mousemove', movingTag);
      $(document).off('mouseup blur', '.line', movingTagOut);

};
$(document).on('mouseenter', '.line', function(){

  var line = $(this);
      line.addClass('movingTag');

      $(document).on('mousemove', movingTag);
      $(document).on('mouseleave blur', '.line', movingTagOut);

});
// .keys {text-align: center; opacity: 0; transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1); padding: 2vh; color: gray; margin-top: -1.5vh; float: left; margin-left: 0 auto; background: red; position: absolute;}
*/
