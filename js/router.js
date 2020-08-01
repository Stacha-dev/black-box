// IMPORT fce
////////////////////////////////////////////////////////////////////////////////
import {loading, title, error} from './router_fce.js';
import {memex} from './memex.js';
import {blackbox, openBox} from './blackbox.js';
import {log} from './loader.js';


// PREPINAC STRANEK
////////////////////////////////////////////////////////////////////////////////
export function page(url) {

  loading('on');

  // vars
  var file,
      pointers,
      memexPg = false,
      blackboxPg = false;

  // udela pole z url podle /
  if (url != null) {
    var path = url.split('/');
  }

  // main router switch
  switch (path[1]) {


    default: case 'memex': // default ==> homepage
      var file = '/php/page/memex.php',
          memexPg = true;
    break;



    case 'prj': // otevreny projekt
      var file = '/php/page/blackbox.php',
          blackboxPg = url;
          pointers = {"prjId": path[2]};
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

    // podle toho kterou stranku animuju, takova animace se zapne
    if (blackboxPg) {

      // opozdi ostatni funkce
      delay = 500;

      openBox(blackboxPg);

    }


    $('#content').addClass('fadeoutUp');

    var div = $('#content');
      var dur = div.css('transition-duration');
          delay += (dur.substring(0, dur.length-1))*1000;

  }

  // JAKMILE SE DOKONCI FADEOUT, SPUSTIT LOAD OBSAHU
  setTimeout(function(){

        $('#content').remove();
        $("body").append($('<div>', {id: 'content', class: 'fadeout'}));

        // make <br> in log :D ==> for design
        $('#console').append('<br><br>');

        $.post(file, pointers, function(res){

          // OBSAH
          try {

            var obj = JSON.parse(res);

            // preload obrazku
            if (obj.imgs.length) {

              try {

                // preload images
                var imgs = obj.imgs,
                    loaded = [];

                log({"images": "loading started"});

                // for each image preload
                $.each(imgs, function(i) {

                  // url to image
                  var url = imgs[i];

                  // vytvori preload container
                  (function(url, loaded) {

                      // vytvori image a narve ho url
                      var img = new Image();
                      img.src = url;

                        log({"url": url, "msg": "loading started"});

                      // on image loaded oznac ho jako loadnuty
                      img.onload = function() {

                        log({"url": url, "msg": "loaded"});
                        // zapsat jako vyreseno
                        loaded.resolve();

                      };

                  })(url, loaded[i] = $.Deferred());
                });

                // az sou vsechny obrazky nacteny
                $.when.apply($, loaded).done(function() {

                  log({"images": "loaded"});

                    // loadne se content
                    $("#content").append(obj.html);
                    title(url);

                        // load obsahu animaci podle headderu
                        try {

                          switch (obj.headder) {

                            case 'memex':
                              memex();
                              log({"memex": "loaded"});
                            break;

                            case 'blackbox':
                              blackbox();
                              log({"blackbox": "loaded"});
                            break;

                            default:
                            break;
                          }

                        } catch (e) {

                          console.log(e);
                          error('intro error');

                        }

                    // finish loading of log ==> ALSO LOADS CONTENT!!
                    log({"finish": true});

                });

              } catch (e) {

                console.log(e);
                error('preload error');

              }

            // pokud nejsou zadne obrazky k preloadu
            } else {

                // loadne se content
                $("#content").append(obj.html);
                $('#content').removeClass('fadeout');
                title(url);
                loading('off');

            }

          // JSON je rozbitej
          } catch (e) {

              console.log(e);

              if (e instanceof SyntaxError) {
                  error('data not json');
              } else {
                  error('general error');
              }

          }

        });

  }, delay);

  // END LOADING PAGE

}
