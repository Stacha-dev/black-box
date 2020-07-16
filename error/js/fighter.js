/*
*
* strilecka pro error pages
* © stacha.dev
* authors:          Oliver Staša, Petr Chalupa
* safety:           seatbelts
* age restricted:   4+
* fun:              guaranteed
*
*/

/*
*
* constants
*
*/
const win = {"w": $(window).width(),
             "h": $(window).height()},
      fighter = {"w": $("#fighter").width(),
                 "h": $("#fighter").height()};

var bomba = new Image(),
    path = 'error',
    hit = 0;

// simple preaload pro bombu
bomba.src = path+'/data/boom.gif';


/*
*
* smazat element
*
*/
function deleter(e){
  e.remove();
}


/*
*
* vytvor target
*
*/
function target() {

  var time = 1000+4*Math.floor(Math.random()*500),
      timeTarget = 3000+Math.floor(Math.random()*5000),
      left = Math.floor(Math.random()*win.w),
      leftTarget = Math.floor(Math.random()*win.w),
      top = (-1)*win.h/100*10,
      topTarget = win.h-fighter.h,
      errors = ["chyba databáze", "chyba serveru", "chyba psa", "chyba kočky"];

  setTimeout(function(){

    $('body').append('<div class="t" style="top: '+top+'px; left: '+left+'px;">'+errors[Math.floor(Math.random()*errors.length)]+'</div>');
    $('.t').last().animate({top: topTarget+'px', left: leftTarget}, timeTarget, 'linear', function(){
        $('body').append('<h1>SMRT!!</h1>');
    });
    target();

  },
  time);

}


/*
*
* on document start
*
*/
$(document).ready(function(){

  // interval s targetama
  target();

});


/*
*
* pohyb raketky
*
*/
$(document).on('mousemove', function(e){

  $('#fighter').css({left: (e.pageX-fighter.w/2)+'px'});

});


/*
*
* strileni
*
*/
$(document).on('click', function(e){

    e.preventDefault();

    $('#game').append('<audio autoplay onended="deleter(this);"><source src="'+path+'/data/laser.mp3" type="audio/mpeg"></audio>');
    $('#game').append('<div class="ball"></div>');
    $('.ball:last-child').css({left: (e.pageX-$('.ball').width()/2)+'px', bottom: (fighter.h/2)+'px'});
    $('.ball:last-child').animate({bottom: "100vh"}, {

          duration: 1500,
          easing: 'linear',
          step: function(krok){

            var kule = $(this),
                ball = new Object(),
                targets = $('.t');

                ball.ct = kule.offset().top+kule.height()/2;
                ball.cl = kule.offset().left+kule.width()/2;

            targets.each(function(){

              var link = $(this),
                  elem = new Object(),
                  targets = $('.t');

                  elem.l = link.offset().left;
                  elem.t = link.offset().top;
                  elem.r = elem.l+link.outerWidth();
                  elem.b = elem.t+link.outerHeight();

                    // TEST FOR HIT && exec hit
                    if ((elem.l < ball.cl && elem.r > ball.cl) &&
                        (elem.t < ball.ct && elem.b > ball.ct) &&
                        !link.hasClass('trefen')) {

                          $('#game').append('<audio autoplay onended="deleter(this);"><source src="'+path+'/data/boom.mp3" type="audio/mpeg"></audio>');
                          $('#game').append('<div class="exploze" style="top: '+ball.ct+'px; left: '+ball.cl+'px"></div>');

                            link.addClass('trefen');
                            kule.remove();
                            link.stop();

                            $('.exploze:last-child').fadeOut(1000, function(){
                              $(this).remove();
                            });

                          hit++;

                    }

            });
    }, complete: function(){
      $(this).remove();
    }
    });

});
