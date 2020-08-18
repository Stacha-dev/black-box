/*
ou shit router!
lady gaga would aprove
*/
import {loading, title, error} from './router_fce.js';
import {memex} from './memex.js';
import {blackbox, openBox} from './blackbox.js';
import {log} from './loader.js';


/*
basic router
do page() tece url z adresy
funkce zavola podle switche soubory a funkce k te url
*/
export function page(url) {

  loading('on');

  // vars
  var file,
      pointers,
      memexPg = false,
      blackboxPg = false,
      logBr = false;

  // udela pole z url podle /
  if (url != null) {
    var path = url.split('/');
  }

  // main router switch
  switch (path[1]) {


    default: case 'memex': // default ==> homepage
      var file = '/php/page/memex.php',
          memexPg = true,
          logBr = true;
    break;



    case 'prj': // otevreny projekt
      var file = '/php/page/blackbox.php',
          blackboxPg = url;
          pointers = {"prjId": path[2]},
          logBr = true;
    break;



    case 'list': // seznam projketu
      var file = '/php/page/list.php',
          logBr = true;
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

          // importuje admin funkce
          if (typeof path[2] != 'undefined' && path[2] != 'home') {
            //import './admin.js'; // proc to nefunguje??
            $('head').append('<script type="module" src="/js/admin.js"></script>');
          }
          // stranky adminu
          switch (path[2]) {
            default: case 'home':
              var file = '/php/admin/admin.php';
            break;
            case 'projects':
              var file = '/php/admin/projects.php',
                  pointers = {'action': path[3], 'id': path[4]};
            break;
            case 'data':
              var file = '/php/admin/data.php',
                  pointers = {'action': path[3], 'id': path[4]};
            break;
          }

        }
    break;


  }



  // START LOADING PAGE
  var content = $('#content'),
      delay = 0;

  // udela <br> in log pred logovanim, je to tak hezci
  if (logBr) {
    $('#console').append('<br><br>');
  }

  // POKUD JE UVNITR STRANKY #CONTENT, UDELAT FADEOUT
  if (content.length) {

    // podle toho kterou stranku animuju, takova animace se zapne
    if (blackboxPg) {

      // opozdi ostatni funkce
      delay = 500;
      // provede prechod mezi memexem a blackboxem (shadowMaster)
      openBox(blackboxPg);

    }

    // fadeout obsahu
    content.addClass('fadeoutUp');

    var dur = content.css('transition-duration');

        delay += (dur.substring(0, dur.length-1))*100; // *1000 = 1000 × pocet vterin

  }


  // JAKMILE SE DOKONCI FADEOUT, SPUSTIT LOAD OBSAHU
  setTimeout(function(){

        content.remove();
        $("body").append($('<div>', {id: 'content', class: 'fadeout'}));

        $.post(file, pointers, function(res){

          // OBSAH
          try {

            var obj = JSON.parse(res);

            // preload obrazku
            if (typeof obj.imgs !== 'undefined' && obj.imgs.length) {

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
                              error('no afterload selector');
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

                log({'headder': obj.headder, 'finish': true});

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
