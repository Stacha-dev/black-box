// GRABBER
$(function(){

  // constants
  var grabMov = false,
      curMov = {"x": 0, "y": 0},
      win = {"h": $(window).height(),
             "w": $(window).width()};

  // z index na pocet movables
  window.zindex = $('.moveable').length+1;

  // id objektu kterym hybu
  window.moveId = false;


  // main fce
  // pohyb mysi
  const moveMov = function(e) {

    var moving = $('.moving'),
        mover = {"pos": moving.position(),
                 "h": moving.height(),
                 "w": moving.width()};

    if (grabMov && window.moveId == moving.attr('id')) {

      var movement = {"x": e.pageX || e.originalEvent.touches[0].pageX,
                      "y": e.pageY || e.originalEvent.touches[0].pageY};

      // presun na pozici dle posunuti
      var moveX = movement.x+curMov.x,
          moveY = movement.y+curMov.y;

      // ochrana proti zahozeni objektu mimo obrazovku
      if (moveX < win.w-mover.w/2 && moveX > mover.w/2) {
        moving.css({left: moveX});
      }
      if (moveY < win.h-mover.h/2 && moveY > mover.h/2) {
        moving.css({top: moveY});
      }

    }

  };

  // ukonceni movementu
  const outMov = function(e) {

    grabMov = false;

      // odstrani grabbed rucku
      $('.moveable').removeClass('moving');

      // vypnout event listenery
      $(document).off('mousemove touchmove', moveMov);
      $(document).off('mouseup blur touchend', outMov);

  };

  // zacatek grabu
  $(document).on('mousedown touchstart', '.moveable', function(e) {

    // zastavi animovani, pokud se deje
    $(this).stop();
    e.preventDefault();

    // pozice
    var mover = {"pos": $(this).position(),
                 "h": $(this).height(),
                 "w": $(this).width()},
        movement = {"x": e.pageX || e.originalEvent.touches[0].pageX,
                    "y": e.pageY || e.originalEvent.touches[0].pageY};

    window.moveId = $(this).attr('id');

    curMov.x = mover.pos.left + mover.w/2 - movement.x;
    curMov.y = mover.pos.top + mover.h/2 - movement.y;

    // potvrzuje grab
    grabMov = true;
    window.zindex++;

    // zapne grabbed rucku
    $(this).addClass('moving');
    $(this).css({"z-index": window.zindex});

      // event listenery
      $(document).on('mousemove touchmove', moveMov);
      $(document).on('mouseup blur touchend', outMov);

  });

});
