// LOADING NAHORE LISTA
////////////////////////////////////////////////////////////////////////////////
export function loading(e) {

  switch (e) {

    case 'on':
      if (!$('#loading').length) {
        $('body').prepend('<div id="loading"></div>');
          $('#loading').stop(true, false).fadeIn(100);
      }
    break;

    case 'off':
      $('#loading').stop(true, false).fadeOut(500,
      function() {
        $('#loading').remove();
      });
    break;

  }

}



// URL A TITULEK STRANKY
////////////////////////////////////////////////////////////////////////////////
export function title(new_url) {

    var title = new_url;

    if (new_url) {
      new_url = location.protocol+'//'+location.host+'/'+new_url;
    } else {
      $('#menu li').removeClass('selected');
      new_url = location.protocol+'//'+location.host;
    }

  // TITLE A URL
  $.get('/php/title.php?t='+title, function(title){
      document.title = title;
      window.history.pushState("object or string", title, new_url);
  });

}
