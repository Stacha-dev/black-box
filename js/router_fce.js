// ERRORS
////////////////////////////////////////////////////////////////////////////////
export function error(e) {

  alert(e);

}



// LOADING NAHORE LISTA
////////////////////////////////////////////////////////////////////////////////
export function loading(e) {

  switch (e) {

    case 'on':

      if (!$('#loading').length) {
        $('body').append('<div class="loading t"></div><div class="loading r"></div><div class="loading b"></div><div class="loading l"></div>');
          $('.loading').stop(true, false).fadeIn(100);
      }

    break;

    case 'off':

      $('.loading').stop(true, false).fadeOut(500,
      function() {
        $('.loading').remove();
      });

    break;

  }

}



// URL A TITULEK STRANKY
////////////////////////////////////////////////////////////////////////////////
export function title(new_url) {

  var title = new_url;
  new_url = location.protocol+'//'+location.host+''+new_url;

  // TITLE A URL
  $.post('/php/title.php', {url: title}, function(title) {
      document.title = title;
      window.history.pushState("object or string", title, new_url);
  });

}



// PREPINA MOZNOST SCROLLOVAT V DIVU
////////////////////////////////////////////////////////////////////////////////
export function disableScroll(elem, state) {

  const noScroll = function(e){
    e.preventDefault();
  }

  switch (state) {
    case 'toggle':
      if ($(elem).hasClass('disableScroll')) {
        $(elem).off().removeClass('disableScroll');
      } else {
        $(elem).on('wheel', noScroll).addClass('disableScroll');
      }
    break;
    case true:
      $(elem).on('wheel', noScroll).addClass('disableScroll');
    break;
    case false:
      $(elem).off().removeClass('disableScroll');
    break;
  }

}
