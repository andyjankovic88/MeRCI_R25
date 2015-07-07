home_class = function () {

};

home_class.prototype.initPageEvents = function() {

  $('.button-collapse').sideNav({
    menuWidth: 240,
    activationWidth: 70,
    closeOnClick: true,
    edge: 'right'
  });

  $(".dropdown-button").dropdown({
    hover: false,
    belowOrigin: true
  });

  Waves.displayEffect({duration: 320})

};


function makePeriod(r, inputformat) {  

    var addEvent = addEventEasy;
   
    if (!document.addEventListener) {
      addEvent = addEventHard;  
    }

    function addEventEasy (el, type, fn) {
      return el.addEventListener(type, fn);
    }

    function addEventHard (el, type, fn) {
      return el.attachEvent('on' + type, fn);
    }
   
    var MAKER = ' - ';
    var fmt = inputformat;
    var classContainer ='rd-container' ;
    var isPeriod = r.period;

    var dateCon = document.getElementsByClassName(classContainer);

    if (dateCon.length > 0) {

      addEvent(dateCon[0], 'click', function(event) {
        if (!isPeriod)
          return;
        var classname = event.target.className;
        var classlist = classname.split(' ');
        classname = classlist[0].trim();       

        switch (classname) {
          case 'rd-day-body':            
            var val = r.associated.innerHTML;
            var selected = r.getDate();
            
            if (r.dates.length == 1 && moment(selected) > moment(r.dates[0])) {
              val = moment(r.dates[0]).format(fmt) + MAKER + moment(selected).format(fmt);
            
              r.associated.value = val;                           
              r.dates.push(new Date(selected));
              r.setValue(r.dates[0]);
              r.hide();
            }
            else {                     
                r.associated.value = moment(selected).format(fmt) + MAKER;           
                r.dates = [];
             
              r.dates.push(new Date(selected));
            }
          break;

          case 'rd-back':            
            if (r.dates.length == 2) {
              r.associated.value = moment(r.dates[0]).format(fmt) + MAKER + moment(r.dates[1]).format(fmt);
            }
            else {
              r.dates = [];
              var selected = r.getDate();
              r.dates.push(new Date(selected));
              r.associated.value = moment(selected).format(fmt) + MAKER;  
            }
            
          break;
          case'rd-next':
            switch (r.dates.length) {             
              case 2:
                r.associated.value = moment(r.dates[0]).format(fmt) + MAKER + moment(r.dates[1]).format(fmt);
              break;
              case 1: 
                r.associated.value = moment(r.dates[0]).format(fmt) + MAKER;
              break;
              case 0:
                r.dates.push(new Date(r.getDate()));                
                r.associated.value = moment(r.dates[0]).format(fmt) + MAKER;
              break;
            }
          
          break;
        };      
      
      });

      addEvent(r.associated, 'blur', function() {
        if (!isPeriod)
          return;
        if (r.dates.length == 2) {          
          val = moment(r.dates[0]).format(fmt) + MAKER + moment(r.dates[1]).format(fmt);            
          r.associated.value = val;     
        };
      });


    }
};

$(document).ready(function () {
  Home = new home_class();
  Home.initPageEvents();
  var r = rome(Dates, {
    "inputFormat": "MMM DD",
    "monthsInCalendar": 2,
    "time": false,
    autoClose : false
    });

  
  r.dates = [];
  r.period = true;
  makePeriod(r, 'MMM DD');  

 
  
});
