/* -- Airport Autocomplete Panel -- */
auto_class = function () {
  this.isOutbound = true;
};

auto_class.prototype.initPageEvents = function() {

  var self = this;

  // Pick Airport

  $(".from-to, #From, #To").on("focus", function(e) {

    e.preventDefault();

    // Store variable for later
    self.isOutbound = $(this).hasClass("outbound");

    // Open Window
    $("#autocomplete-airport").addClass("active");
    $(".air-input-overlay").addClass("active");

    // Focus the input once the element has been displayed
    setTimeout(function() {
      $("#air-input").focus();
    }, 450);
  });

  // Close overlay
  $("nav.for-overlay a.back-button").click(function(e) {
    e.preventDefault();

    $(this).closest("nav.for-overlay").removeClass("active");
    $(".overlay-modal.active").removeClass("active");

  });

  // Close panel on item click
  $("ul.result-list li").click(function(e) {

    var airPort = $(this).attr("data-port");

    // Figure out which input value we are talking about
    var $inputField;
    if(self.isOutbound) {
      $inputField = $("#From");
    }
    else {
      $inputField = $("#To");
    }

    // Set the input value, and make it visually active
    $inputField.val(airPort);
    $inputField.siblings("i, label").addClass("active");

    // Close Panel
    $(".air-input-overlay.active").removeClass("active");
    $("#autocomplete-airport").removeClass("active");
  });

};


$(document).ready(function () {
    AutoAirports = new auto_class();
    AutoAirports.initPageEvents();
});
