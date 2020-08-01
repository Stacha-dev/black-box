import {page} from './router.js';
import {links} from './memex.js';

// ON LOAD
////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

      var url = window.location.pathname;
      page(url);

});

// KDO DNESKA MACKA tl. ZPET?!
////////////////////////////////////////////////////////////////////////////////
$(window).on('popstate', function(e){

      var url = window.location.pathname;
      page(url);
      e.preventDefault();

});

// A HREF REBUILD
////////////////////////////////////////////////////////////////////////////////
$(document).on('click touch', 'a', function(e){

  var link = $(this).attr('href');
  page(link);
  e.preventDefault();

});

// ON PROJECT CLICK ==> trigger title href
////////////////////////////////////////////////////////////////////////////////
$(document).on('click touch', '.prj', function(e){

  $(this).find('a').trigger('click');

});

// ON RESIZE reload linek
////////////////////////////////////////////////////////////////////////////////
$(window).on('resize', function(e){

  // pokud vubec linky existuji
  if ($('.line').length) {

    $('.line').remove();
    links('resize');

  }

  var con = $("#console");
  if (con.hasClass('disableScroll')) {
    setTimeout(function(){
      con.stop(true, false).animate({scrollTop: con.prop('scrollHeight') - con.innerHeight()}, 500, 'easeOutExpo');
    }, 1000);
  }

});











// tuto funkci sem vyradil a ani ji nikomu neukazoval, vypadalo to debilne :D
/*

// kdyz nejdu na vyobrazeni, presune dopredu ten element na ktery najizdim
function backToZ(li, postId, zindex){

  $('#post'+postId).css({"z-index": zindex});
  $(document).off('mouseout', li);

}
// event listener k tomu
$(document).on('mouseover', '.info li', function(){

  var li = $(this),
      postId = li.attr('post'),
      post = $('#post'+postId),
      zindex = post.css("z-index") || 0;

      post.css({"z-index": 99});

  $(document).on('mouseout', li, function(){backToZ(li, postId, zindex);});

});

*/









import {disableScroll} from './router_fce.js';

// konzole zobrazit/schovat
function consoleToggle(){

  const con = $('#console');

  // prepne tridy a z neaktivni scrollovaci
  con.toggleClass('log grabber');
  disableScroll('#console', 'toggle');

  // zastavit vsechny animace a posunout zase na konec k napisu blackbox
  con.stop().animate({scrollTop: con.prop('scrollHeight') - con.innerHeight()}, 500, 'easeOutExpo');

}

// event listener na zobrazeni konzole:
// 1. pomoci tlacitka na webu
$(document).on('click touch', '.toggleLog', consoleToggle);

// 2. pomoci klavesy pro konzoli ";"
$(document).on('keypress', function(e){

  var ch = e.which || e.keyCode;
  if (ch == 59 || ch == 96) {
    consoleToggle();
  }

});

// event listener na rozkliknuti textu k infu v rozhozenych projektech ikonou
$(document).on('click touch', '.moreInfo', function(){

  $(this).toggleClass('up').closest('.info').toggleClass('showInfo');

});
// event listener na rozkliknuti textu k infu v rozhozenych projektech dvojklikem
$(document).on('dblclick', '.info', function(){

  $(this).toggleClass('showInfo').find('.moreInfo').toggleClass('up');

});


// event listener na zvetseni postu v blackboxu ikonou
$(document).on('click touch', '.bigPost', function(){

  $(this).toggleClass('up').closest('.post').toggleClass('large');

});
// event listener na zvetseni postu v blackboxu dvojklikem
$(document).on('dblclick', '.post', function(){

  $(this).toggleClass('large').find('.bigPost').toggleClass('up');

});
