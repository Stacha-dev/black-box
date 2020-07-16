// MEMEX
// udela boxy pro umco ve forme memexu
export function memex() {

  // constants
        // kolik je projektu
  const projects = $('.prj').length,

        // velikosti elementu
        win = {"h": $(window).height(),
               "w": $(window).width()},
        obj = {"h": $('.prj').height(),
               "w": $('.prj').width()},
        // tol, t = tolerance
        tol = 3,
        t = {"w": Math.floor(obj.w/win.w*100),
             "h": Math.floor(obj.h/win.h*100)},
        // limit je kolik % je odskok z kraje obrazovky
        limit = {"x": t.w/2,
                 "y": t.h/2},
        // pocet projektu na stranku
        pns = 100/t.w;

      // pole pro vysledne koordinaty
  var ress = [],
      // pocet iteraci v each pro projekty
      itt = 0,
      // sirka platna
      minWidth = 100;


  // pokud je vic nez X projektu, zvetsit obrazovku
  if (projects > pns) {
    minWidth = pns*40;
    $('#content').addClass('grabber');
    $('#content').append('<div id="pixelhelper"></div>');
      $('#pixelhelper').css({left: minWidth+'vw'});
  }


  // generovani koordinatu
  function chords() {

        // -10 + 10 ==> vlevo aby byl odskok
    var x = Math.floor(Math.random()*(minWidth-10-limit.x*2))+limit.x+10,
        // 85 + 10 ==> odskok 10vh shora kvuli liste, zespoda 5vh kvuli vzhledu
        y = Math.floor(Math.random()*(85-limit.y*2))+limit.y+10;

    return {"x": x, "y": y};

  }


  // testovani koordinatu
  function chord_tester(pos, pass) {

    var faulty = false;

      // test jestli nenarazi do jineho projektu
      if (ress.length > 0) {
        for (var i = 0; i < ress.length; i++) {

          if (pos.x-tol < ress[i].x+t.w && pos.x+t.w > ress[i].x-tol &&
              pos.y-tol < ress[i].y+t.h && pos.y+t.h > ress[i].y-tol) {
            faulty = true;
            break;
          }

        }
      }

    // posle vysledek zpet do whilu
    // pass ==> pokud while jede uz po 100. pusti i spatne vysledky
    if (faulty == true && pass < 100) {
      return false;
    } else {
      ress.push({"x": pos.x, "y": pos.y});
      return true;
    }

  }

  // MEMEX ==> hlavni funkce
  // for every project
  $('.prj').each(function() {

    var prj = $(this),
        pos = chords(),
        pass = 0;

    // nastavi unikatni souradnice
    while (chord_tester(pos, pass) == false) {
      pos = chords();
      pass++;
    }

    // nastaveni koordinatu projektu
    prj.css({top: pos.y+'vh', left: pos.x+'vw'});
    //setTimeout(function(){
    prj.removeClass('fadeout');
    //}, itt*(1/projects)*1000);

    itt++;

        // po poslednim umisteni projektu spustit linkovani
        if (itt == projects) {
          links();
        }

  });

  var scrollCenter = $('#content').width() * (minWidth / 100) / 2 - $(window).width() / 2;
  $('#content').animate({scrollLeft: scrollCenter}, 1000);

}



// LINKS
// vytvoreni linku (car) mezi projektama
export function links() {

    // funkce na testovani duplicity konexi
    function inNet(match) {

        // projde kazdou polozku v netu
        for (var n = 0; n < net.length; n++) {

            // porovna jestli nejde o duplikat
            if (net[n][0] == match[0] && net[n][1] == match[1]) {
                return true;
            }
        }

        return false;
    }

    var project = [];
    // nahraje tagy a pozice z kazdeho projektu
    $('.prj').each(function() {

      var prj = $(this),
          obj = {"h": prj.height(),
                 "w": prj.width(),
                 "x": parseInt(prj.css('left'), 10),
                 "y": parseInt(prj.css('top'), 10)},
          tags = prj.attr('tags'),
          id = prj.attr('id');

          // nahraje do objektu vsechny udaje o projektu
          project.push({"id": id, "obj": obj, "tag": tags.split(",")});

    });

    // create array of connections
    // console.log(project);
    // projede vsechny projekty
    var net = [];
    $.each(project, function(i, pr){

      // projede vsechny tagy v projektu
      $.each(pr.tag, function(ti, tg){

        // porovna je se vsema ostatnima tagama v ostatnich projektech
        $.each(project, function(li, lpr){

          // pokud uz se projekt prochazel, nevyhodnocuje ho
          if (i < li) {

            // otestovat pokud se najde shoda
            var shoda = lpr.tag.indexOf(tg);
            if (shoda != -1) {

              // pokud se nasha shoda, otestovat jestli uz neni v netu
              var match = [project[i].id, project[li].id].sort();

              // jestli jeste neni v poli, pridat shodu
              if (!inNet(match)) {
                net.push(match);
              }

            }

          }

        });

      });

    });

    // pro kazdou konexi vytvori cary mezi nima
    var itt = 0;

    $.each(net, function(){

      // najde o kterou polozku v poli se jedna a vraci objekt
      var spoj = $(this),
          obj1 = project.find(o => o.id === spoj[0]),
          obj2 = project.find(o => o.id === spoj[1]),
          limit = 5,
          lim = {"x1": obj1.obj.w/limit,
                 "y1": obj1.obj.h/limit,
                 "x2": obj2.obj.w/limit,
                 "y2": obj2.obj.h/limit};

      // nasetuje x a y souradnice pro zacatek a konec cary
      var chor = {"x1": Math.random() * (obj1.obj.w - lim.x1*2) + (obj1.obj.x - obj1.obj.w/2) + lim.x1,
                  "y1": Math.random() * (obj1.obj.h - lim.y1*2) + (obj1.obj.y - obj1.obj.h/2) + lim.y1,
                  "x2": Math.random() * (obj2.obj.w - lim.x2*2) + (obj2.obj.x - obj2.obj.w/2) + lim.x2,
                  "y2": Math.random() * (obj2.obj.h - lim.y2*2) + (obj2.obj.y - obj2.obj.h/2) + lim.y2};

      $('#content').append('<div style="position: absolute; top: '+chor.y1+'px; left: '+chor.x1+'px; width: 3px; height: 3px; background: red; z-index: 999;"></div>');
      $('#content').append('<div style="position: absolute; top: '+chor.y2+'px; left: '+chor.x2+'px; width: 3px; height: 3px; background: red; z-index: 999;"></div>');

      // spocita delku cary a uhel
      var len = Math.sqrt(((chor.x2-chor.x1)*(chor.x2-chor.x1))+((chor.y2-chor.y1)*(chor.y2-chor.y1))),
          ang = Math.atan2((chor.y1-chor.y2),(chor.x1-chor.x2))*(180/Math.PI);

      // vykresli caru
      $('#content')
      .append($('<div>',{class: 'line',
                         css:   {top:       ((chor.y1+chor.y2)/2)+'px',
                                 left:      ((chor.x1+chor.x2)/2-len/2)+'px',
                                 width:     len+'px',
                                 transform: "rotate("+ang+"deg)"}
                        })
      .delay(itt*100).animate({opacity: 1}, 1000));

       itt++;

    });


}
