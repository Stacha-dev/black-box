import {loading, disableScroll} from './router_fce.js';

// firestarter
var logCount = 0;

// log strelec
export function log(data) {

  // nice json sakra prace
  function niceJson(json){

    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }

    // odstrani html
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // prokontroluje vsechny druhy dat a rozradi je + provede return
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {

      // otestuje ty data o typ a prideli class
      var cls = 'n';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'k';
        } else {
          cls = 's';
        }
      } else if (/true|false/.test(match)) {
        cls = 'b';
      } else if (/null/.test(match)) {
        cls = 'null';
      } else {

        // zaokrouhli cislo na desetinne mista (je to tak hezci)
        match = Math.floor(match* 10000)/10000;
      }

      // prida do vysledku
      return '<span class="'+cls+'">'+match+'</span>';
    });

  }

  // pokud konzole neni v html, pridej
  if (!$('#console').length) {
    $('body').append($('<div>', {id: 'console', class: 'log'}));
  }

  // variables
  var con = $('#console'),
      delay = logCount*30+(Math.random()*20),
      totalDelay =+ delay;

      // pokud se vola log znova, tak zobrazit
      if (!con.hasClass('log')) {
        con.addClass('log');
      }

      // on finish of loading
      if (data.finish == true) {

        // exit console
        setTimeout(function(){

          // erase log counter
          logCount = 0;

          // napise zakonceni konzole
          con.append('<br><br><div class="menuTop">ČERNÁ SKŘÍŇKA / BLACK BOX<div class="tools"><span class="toggleLog">☷</span> ☰ EN</div></div>');
          con.scrollTop(con.prop('scrollHeight') - con.innerHeight());

          // disable scrolling
          disableScroll('#console', true);

          // IMPORTANT!
          setTimeout(function(){

            // load content + hide log
            $('#console').removeClass('log');
            $('#content').removeClass('fadeout');

            // turn loading off
            loading('off');

          }, 300);

        }, totalDelay+100);

      }

  // write line to log
  setTimeout(function(){

    con.append('<ul><li>'+niceJson(data)+'</li></ul>');
    con.scrollTop(con.prop('scrollHeight') - con.innerHeight());

  }, delay);

  // itt
  logCount++;

}
