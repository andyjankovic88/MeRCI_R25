/* -- Flex Class handles the flexible date sliding panel and content loading -- */
flex_class = function () {
  this.ajaxDelay = 500; // Time in ms to wait for carousel to stop moving before making an Ajax Call
};

flex_class.prototype.initPageEvents = function() {

  var self = this;

  // Setup the date carousel
  $(".date-carousel").royalSlider({
    keyboardNavEnabled: false,
    startSlideId: 4,
    visibleNearby: {
      enabled: true,
      centerArea: 0.3,
      center: true,
      navigateByCenterClick: false,
      breakpoint: 768,
      breakpointCenterArea : 0.29
    },
    addActiveClass : true,
    controlNavigation: 'none',
    arrowsNav: true,
    arrowsNavAutoHide: false,
    slidesSpacing: 0
  });


  // Setup on slide change function
  $(".date-carousel").each(function() {

    var oData = $(this).data('royalSlider');

    oData.ev.on('rsAfterSlideChange', function(event) {

      window.clearTimeout(self.doUpdate);

      // Make sure flight results items are view
      self.checkResultsInView();

      self.doUpdate = setTimeout(function() {

        // jQuery element of the slide
        var $slide = $(oData.currSlide.content[0]);

        self.updateResults($slide);

      }, self.ajaxDelay);
    });
  });

  // Make sure flight items are in view on date click
  $(".date-item").click(function() {
    self.checkResultsInView();
  });
};

// Scroll flight elements in to view if element is not 80% showing
flex_class.prototype.checkResultsInView = function() {

  var threshold = 0.8; // If results are < 80% showing then scroll in to view
  var $results = $(".search-results.active:visible").last();
  var winHeight = $(window).height(); // 568
  var scrollTop = $(window).scrollTop(); // 524
  var searchTop = $results.position().top; // 812
  var percentageVisible = 1 - (searchTop - scrollTop + Flow.fixedOffset) / winHeight;// 0.5 or  50%

  // Make sure flights are visible in view port
  if(percentageVisible < threshold) {
    // Scroll element to the top on date selection
    $results.velocity("scroll", { duration: 1100, easing: "ease-in-out", offset: Flow.fixedOffset });
  }
};


// Simulate ajax loading of flight results
flex_class.prototype.updateResults = function($slide) {

  var self = this;

  // Here we would do an Ajax Call based on the data we have
  var date = $slide.attr("data-date") || "today";
  var $results = $(".search-results.active .flights");

  // Set loading indicator
  $results.addClass("loading");

  // Simulate ajax load
  // @BGLR : On ajax load we would want to make sure we cancel any previous requests to save DB calls
  window.clearTimeout(self.loadingFlights);

  // This is where the ajax call would go
  // You can cancel ajax calls with .abort()
  self.loadingFlights = setTimeout(function() {
    $results.removeClass("loading");
    console.log("loaded " + date);
  }, 5500);
};

$(document).ready(function () {
  Flex = new flex_class();
  Flex.initPageEvents();
});
