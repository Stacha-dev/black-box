/*
main functions
https://youtu.be/xW3sZqk8-4w?t=657
lady gaga 4 ever
*/

"use strict";

// IMPORT fce
////////////////////////////////////////////////////////////////////////////////
import {page} from './router.js';
import './grabber.js';

/*
// EVENT LISTENERS
*/
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

// ON RESIZE reload linek
////////////////////////////////////////////////////////////////////////////////
/*
$(window).on('resize', function(e){

    $('.line').remove();
    setTimeout(function(){links();}, 1000);

});
*/

// EASING
jQuery.extend(jQuery.easing,
{
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	}
});
