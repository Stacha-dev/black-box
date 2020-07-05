// IMPORT fce
////////////////////////////////////////////////////////////////////////////////
import {loading, title} from './router_fce.js';
import {json2html} from './json2html.js';

// PREPINAC STRANEK
////////////////////////////////////////////////////////////////////////////////
export function page(url) {

  loading('on');

  if (url != null) {
    var path = url.split('/');
    var page = path[1];
  }

  switch (url) {


    default: case 'memex': // default ==> homepage
      var file = '/php/page/memex.php';
    break;



    case 'lang': // zmena jazyku
    break;



    case 'reload': // reload
      window.location.reload();
    break;



    case 'admin': // administrace
        if (url == '/admin/logout') {
            $.get('/php/admin/logout.php', function(res) {
              if (res == 'loggedout') {
                page('memex');
              } else {
                error('logout failed');
              }
            });
        } else {
          var file = '/php/admin/index.php';
        }
    break;


  }



  // START LOADING PAGE
  // POKUD JE UVNITR STRANKY #CONTENT, UDELAT FADEOUT
  if ($('#content').length) {
    $('#content').addClass('fadeout');
    var div = $('#content');

      var dur = div.css('transition-duration');
      var delay = (dur.substring(0, dur.length-1))*1000;
  } else {
    var delay = 0;
  }

  // JAKMILE SE DOKONCI FADEOUT, SPUSTIT LOAD OBSAHU
  setTimeout(function(){

        $("body").html('<div id="content" class="fadeout"></div>');

        $.get(file, function(res){

          var obsah = json2html(res);

          $("#content").append(obsah);
          $('#content').removeClass('fadeout');

          title(url);
          loading('off');

        });

  }, delay);

  // END LOADING PAGE

}
