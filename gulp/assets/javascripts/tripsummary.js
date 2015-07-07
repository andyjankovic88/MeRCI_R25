summary_class = function () {
  this.$tripSummary = $("#trip-summary");
  this.$tripContent = $("#trip-summary-content");
};

summary_class.prototype.initPageEvents = function() {
  var self = this;

  // Toggle the trip summary bar on click
  $("#trip-summary .title").click(function() {

    if(self.$tripContent.hasClass("active")) {
      self.openSummaryBar(true);
    }
    else {
      self.openSummaryBar();
    }
  });

  $(".summaryClose").click(function() {
    self.openSummaryBar(true);
  })

  // Below is placeholder functionality that should be ported to a data binding solution (i.e. Aria templates / object model)
  // Make sure passenger one is showing
  $("a[data-page='passengerAdditional']").click(function() {

    self.$tripContent.find(".passenger-summary").show().find("ul.passenger-list li:first-child").show();
  });

  // Make sure passenger two is showing
  $("a[data-page='services']").click(function() {
    self.$tripContent.find(".passenger-summary").show().find("ul.passenger-list li:nth-child(2)").show();
  });

  // Check on page load if passengers should be showing
  $(window).load(function(){

    // Use setTimeout so breadcrumbs can update via page transition class
    setTimeout(function() {
      var isAfterPassengers = $(".breadcrumbs li.active").index() >= 2;
      if(isAfterPassengers) {
        self.$tripContent.find(".passenger-summary").show().find("ul.passenger-list li").show();
      }
    }, 1100);
  });
};

// Update trip summary bar price
// @BGLR this should be hooked up to your data-binding solution
summary_class.prototype.updatePrice = function(price) {

  if(typeof price == "undefined" || price < 0) {
    return;
  }

  // Change text price and pulse
  var $total = this.$tripSummary.find(".price-total");
  var $dollars =  $total.find(".dollars");
  $dollars.text(price);
  $total.addClass("animated pulse");

  // Reset for future animations
  setTimeout(function() {
    $total.removeClass("animated pulse");
  }, 1100)
};

// Open or close the trip summary bar
// *bClose (boolean) (optional) - set to true to close the summary bar instead of open it
summary_class.prototype.openSummaryBar = function(bClose) {
  var self = this;

  // Close the summary bar
  if(bClose) {
    self.$tripSummary.removeClass("active")

    // Make sure we are at the top of the page when we are closing the trip summary bar
    $("html, body").velocity("scroll", { duration: 550, easing: "ease-in-out" }, { queue: false});

    self.$tripContent.stop().removeClass("active").slideUp(1100);
  }
  // Open it (default)
  else {

    // Make sure we are at the top of the page before we slide open the summary bar
    $(window).scrollTop(0);
    self.$tripSummary.addClass("active")

    self.$tripContent.stop().addClass("active").slideDown(1200);
  }
};

$(document).ready(function () {
    Summary = new summary_class();
    Summary.initPageEvents();
});
