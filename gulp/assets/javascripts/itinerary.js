// This class is responsible for handling itinerary mode interactions
itin_class = function () {

  // Boolean to toggle mode on or off.
  // currently turned on via query string for testing.
  this.itineraryMode  = getParameterByName("itn").length > 0;
};

itin_class.prototype.initPageEvents = function() {

  this.initSelectItineraryEvents();

  // Show itinerary details on click
  $(".flight .details").click(function() {
    var $details = $(this);
    var $parent = $(this).parent();
    var $flightDetails = $parent.find(".flight-details");
    var slideDuration = 500;
    var offset = $parent.hasClass("single") ? 0 : 6;
    offset = Flow.fixedOffset - offset;

    // Set active state
    $parent.toggleClass("active");

    var isActive = $parent.hasClass("active");

    // Open
    if(isActive) {

      $details.velocity("scroll", { duration: 750, easing: "ease-in-out", offset: offset  }, { queue: false});

      $flightDetails.velocity("slideDown", { duration: slideDuration });
    }
    // Close
    else {
      $flightDetails.velocity("slideUp", { duration: slideDuration });
    }
  });

  // Fare families
  $("ul.fare-select > li i, ul.fare-select > li > label").click(function(e) {
    e.preventDefault();
    var family = $(this).closest("li").attr("data-family");
    var $overlay = $(".overlay.farefamilies");

    // Open the overlay
    $overlay.addClass("active");
    $("body").addClass("overlay-active")

    // Open the relevant family by triggering a click
    setTimeout(function() {
      var $item = $overlay.find(".family-accordion ." + family);
      var isOpen = $item.hasClass("active");
      if(!isOpen) {
        $item.find(".collapsible-header" ).click();
      }
    }, 800);

  });
};

itin_class.prototype.initSelectItineraryEvents = function() {

  // When selecting a flight, turn card into summary, then animate up to page
  $(".search-results.itinerary .flight-details a.price-select").click(function(e) {
    e.preventDefault();

    // Cache selectors
    var price = $(this).find("span").text();
    var $item = $(this).closest(".flight");
    var $cloned = $item.clone();  // Will append this to summary card
    var $results = $(this).closest(".search-results");
    var isFlexible = $("#FlexCheck").is(":checked");
    var $flexContainer = $(".matrix-results");
    var $summary = $("#itinerary-summary");
    var offset = 14; // offset scroll from summary. Typically due to margin


    // First make sure the summary container is tall enough to allow us to scroll  up to the new summary element
    $(".summary-container").addClass("active");

    // Store reference to the item we cloned from
    $summary.find(".content").data("item", $item);

    // No longer need flight details, but let's mark it to be opened later on edit
    $(this).closest(".flight-details").hide().addClass("previous-selection");

    // Prep the summary element
    $cloned.find(".expandable").hide(); // Make sure nothing is open in the summary
    $summary.find(".content").html("").append($cloned);
    $summary.show();

    // No longer need the results
    $results.hide();

    // Make sure flexible container isn't showing
    if(isFlexible) {
      $flexContainer.hide();
    }

    // Next scroll up (don't animate) to where the results summary lives
    // Since the summary starts out transformed (we animate it up 50%),
    // * we have to take that into account for our scroll offset
    offset += $summary.height() / 2;

    // Now we can scroll up to ITN summary
    var scrollTo = $("#itinerary-summary").offset().top - offset + Flow.fixedOffset;
    $(window).scrollTop(scrollTo);

    // Show the results summary by animating it in
    // Wait a bit so the user can tell what's going on
    setTimeout(function() {

      // Animate the summary in
      $summary.addClass("active");

      // Show confirm page
      $(".summary-container").removeClass("active");

      // Show summary
      $(".finalize-step").show();

      $(".summary-container").removeClass("active");

      // Update final price based on taxes
      // todo
      //self.updateFinalPrice();

    }, 200);

  });

};

itin_class.prototype.showSearchResults = function() {

  var self = this;

  // Ready to search again
  $("#Search").removeClass("disabled searching");

  // Start with departing flight
  Flow.$allContainer = $(".search-results.itinerary");

  // Get into DOM
  Flow.$allContainer.show();

  // Animate out while scrolling
  setTimeout(function() {

    Flow.$allContainer.find(".messaging-container").addClass("active");
    Flow.$allContainer.addClass("active");
    Flow.$allContainer.find(".flights").addClass("active");
  }, 500);

  // Scroll to element
  //$("html, body").animate({ scrollTop : Flow.$allContainer.offset().top + 3 }, 1000);

  Flow.$allContainer.velocity("scroll", { duration: 1200, easing: "ease-in-out", offset: 3 + Flow.fixedOffset }, { queue: false});

};

$(document).ready(function () {
    Itin = new itin_class();
    Itin.initPageEvents();
});
