// IMPORT fce
////////////////////////////////////////////////////////////////////////////////
import {loading, title, error} from './router_fce.js';
import {memex} from './memex.js';


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
  var delay = 0;
  if ($('#content').length) {
    $('#content').addClass('fadeout');

    var div = $('#content');
      var dur = div.css('transition-duration');
      var delay = (dur.substring(0, dur.length-1))*1000;

  }

  // JAKMILE SE DOKONCI FADEOUT, SPUSTIT LOAD OBSAHU
  setTimeout(function(){

        $('#content').remove();
        $("body").append('<div id="content" class="fadeout"></div>');

        $.get(file, function(res){

          // OBSAH
          try {

            var obj = JSON.parse(res);

              $("#content").append(obj.html);
              $('#content').removeClass('fadeout');
              title(url);

            try {

              switch (obj.headder) {

                case 'memex':
                  memex();
                break;

                default:
                break;
              }

            } catch (e) {
              error('intro error');
            }

          // JSON je rozbitej
          } catch (e) {
              if (e instanceof SyntaxError) {
                  error('data not json');
              } else {
                  error('general error');
              }
          }

          loading('off');

        });

  }, delay);

  // END LOADING PAGE

}
