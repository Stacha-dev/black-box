// GRABBER
$(function(){

  // constants
  var grabMov = false,
      curMov = {"x": 0, "y": 0},
      movedMov = {"x": 0, "y": 0},
      win = {"h": $(window).height(),
             "w": $(window).width()},
      timestampMov = 0;
  // smoothing nastavuje silu dojezdu setrvacnosti pohybu
  const smoothingMov = 2;

  // global val pro smoothing
  window.dir = {"x": 0, "y": 0};
  window.speed = {"x": 0, "y": 0};

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

          // smoothing
          var now = Date.now(),
              curr = {"x": movement.x,
                      "y": movement.y};

          var dt = now-timestampMov;
          var dist = {"x": Math.abs(curr.x-movedMov.x),
                      "y": Math.abs(curr.y-movedMov.y)};
          window.speed = {"x": dist.x/dt*win.w/100*smoothingMov/1.5,
                          "y": dist.y/dt*win.h/100*smoothingMov/1.5};


          window.dir = {"x": 1, "y": 1};
          if (movedMov.x >= curr.x) {
            window.dir.x = -1;
          }
          if (movedMov.y >= curr.y) {
            window.dir.y = -1;
          }

          console.log(dist, movedMov, curr, window.dir, window.speed);

          movedMov = curr;
          timestampMov = now;

    }

  };

  // ukonceni movementu
  const outMov = function(e) {

    grabMov = false;

      // animovat dojezd pokud je mys pustena behem pohybu
      if (window.speed.x > 1 || window.speed.y > 1) {

            // soucasna pozice
        var pos = $('.moving').position(),
            grabpos = {"x": e.pageX || e.originalEvent.touches[0].pageX,
                       "y": e.pageY || e.originalEvent.touches[0].pageY},
            // delka animace dojezdu
            dojezd = (window.speed.x+window.speed.y)*smoothingMov*5;

        // animace dojezdu
        $('.moving').animate({top: grabpos.y+window.dir.y*window.speed.y, left: grabpos.x+window.dir.x*window.speed.x}, dojezd, 'easeOutExpo');
        // reset speed
        window.speed = {"x": 0, "y": 0};

      }

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
