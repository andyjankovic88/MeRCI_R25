/* -- Flow Class is in charge of handling user flow throughout the application -- */
flow_class = function () {
  // Offset of fixed positioning of nav
  // Necessary for scrolling to correct position
  this.fixedOffset = $("#header-nav").height() * -1;
};

flow_class.prototype.initPageEvents = function() {

  this.initSearchEvents();

  this.initSelectFlightEvents();

  this.initFlightInfoEvents();

  this.initSelectFlexFlightEvents();

  this.initEditFlightEvents();
};

// Click on flight for additional information
flow_class.prototype.initFlightInfoEvents = function() {

  // Summary show more
  $(".flight-summary").on("click","footer", function() {
    var $summary = $(this).closest(".flight-summary");

    // Open Item
    $summary.find(".detail").toggleClass("active");
  });
};

// Flexible day select
flow_class.prototype.initSelectFlexFlightEvents = function() {

  var self = this;

  // Flexible flight information expand
  $("li.day .flight-info").click(function() {
    var $listing = $(this).closest(".search-results");
    var isReturn = $listing.hasClass("return");
    var isDepart = !isReturn; // syntactic sugar
    self.$parentItems = $(this).parent();
    var isOneWay = $("#OneWay").is(":checked");


    // If depart and not one way, scroll down to select return date before showing results
    if(isDepart && !isOneWay) {

      var $returnResults = $(".search-results.flex-container.return");
      $returnResults.show();

      // Wait a bit before scrolling down
      setTimeout(function() {
        $returnResults.velocity("scroll", { duration: 1100, easing: "ease-in-out", offset: self.fixedOffset }, { queue: false});

      }, 300);

      setTimeout(function() {
        $returnResults.addClass("active");
      }, 800);

      // Animate items in after showing
      setTimeout(function() {
        $returnResults.find(".flexible-listing").addClass("active");
      }, 1100);
    }
    else {
      // Finished selecting dates, move on to selecting flights
      var $returnResults = $(".search-results.all-container.depart");

      // Wait a second before showing the new results
      setTimeout(function() {

        setTimeout(function() {
          $returnResults.find(".flights").addClass("active");
          $returnResults.find(".flexible-listing").addClass("active");
        }, 1100);

        // Begin to fade out date selection
        $(".flex-container").fadeOut(800, function() {
          // Prep the items in the DOM
          $returnResults.show();

          // Make sure date slider is positioned properly
          $('.date-carousel').royalSlider('updateSliderSize', true);

          $returnResults.velocity("scroll", { duration: 0, easing: "ease-in-out", offset: self.fixedOffset, delay: 0 }, { queue: false});

          $returnResults.addClass("active");
        });

      }, 300);
    }
  });
};

// Select Flight turns into summary card
flow_class.prototype.initSelectFlightEvents = function() {

  var self = this;

  // When selecting a flight, turn card into summary, then animate up to page
  $(".search-results:not(.itinerary) .flight-details a.price-select").click(function(e) {
    e.preventDefault();

    // Cache selectors
    var $item = $(this).closest(".flight");
    var $cloned = $item.clone();  // Will append this to summary card
    var $results = $(this).closest(".search-results");
    var isDeparting = $results.hasClass("depart");
    var isFlexible = $("#FlexCheck").is(":checked");
    var isOneWay = $("#OneWay").is(":checked");
    var $summary = isDeparting ? $("#depart-summary") : $("#return-summary");
    var offset = 14; // offset scroll from summary. Typically due to margin

    // First make sure the summary container is tall enough to allow us to scroll up to the new summary element
    $(".summary-container").addClass("active");

    // Store reference to the item we cloned from
    $summary.find(".detail").data("item", $item);

    // No longer need flight details, but let's mark it to be opened later on edit
    $(this).closest(".flight-details").hide().addClass("previous-selection");

    // Flexible items need a marker as well
    $item.closest(".day").addClass("chosen");

    // Prep the summary element
    $cloned.find(".expandable").hide(); // Make sure nothing is open in the summary
    //$summary.find(".detail").html("").append($cloned);
    $summary.show();

    // Since the summary starts out transformed (we animate it up 50%),
    // * we have to take that into account for our scroll offset
    if(isDeparting) {
      offset += $summary.height() / 2;
    }

    // Currently always scrolling up to depart summary
    var scrollTo = $("#depart-summary").offset().top - offset + self.fixedOffset;

    // First Hide the results list
    $results.hide();

    // Next scroll up (don't animate) to where the results summary lives
    $(window).scrollTop(scrollTo);

    // Show the results summary by animating it in
    // Wait a bit so the user can tell what's going on
    setTimeout(function() {

      // Animate summary card in
      $summary.addClass("active");

      // Show next round of results if applicable
      // (return results is we were departing and we aren't one way)
      if(isDeparting && !isOneWay) {
        // show next set of results
        var $returnResults = $(".search-results.all-container.return");

        // Show em!
        $returnResults.show();
        $(".summary-container").removeClass("active");

        // Make sure date slider is positioned properly
        $('.date-carousel').royalSlider('updateSliderSize', true);
        console.log("show")

        // Wait a second before showing the new results
        setTimeout(function() {
          $returnResults.addClass("active");

          // Animate flight items in
          $returnResults.find(".flights").addClass("active");
          $returnResults.find(".flexible-listing").addClass("active");

        }, 800);
      }
      else {
        // Otherwise we are ready to confirm our flight
        $(".summary-container").removeClass("active");

        // Update price at the bottom
        self.updateFinalPrice();

        // Show summary
        $(".finalize-step").show();

        $(".summary-container").removeClass("active");
      }

    }, 200);

  });


  // Cancel Select Flight Card
  $(".flight-details .actions .cancel").click(function(e) {
    e.preventDefault();

    $(this).closest(".flight-details").slideUp(800);

    $.scrollTo($(this).closest(".flight"), { duration: 800, offset: self.fixedOffset } );
  });
};

// Edit A Flight Card
flow_class.prototype.initEditFlightEvents = function() {

  var self = this;

  $(".flight-summary .edit").click(function(e) {

    e.preventDefault();

    var $card = $(this).closest(".flight-summary");
    var $item = $card.find(".detail").data("item");
    var $results = $item.closest(".search-results");
    var $activeResults = $(".search-results.active");
    var isFlexible = $("#FlexCheck").is(":checked");
    var isFlexItinerary = Itin.itineraryMode && isFlexible;


    // Summary in general is no longer valid
    $(".summary-container").removeClass("active");
    $(".finalize-step").hide();

    // De-activate the summary card
    $card.removeClass("active").hide();

    $results.addClass("active").fadeIn(800);

    // Hide any results panels showing
    $activeResults.hide();

    // Any summary cards below here should now be remove
    // * since we are a step above those items
    // - Clear other items

    // De-activate any summary cards after the existing item
    $card.nextAll(".flight-summary.active").removeClass("active").hide();

    // Prime the results panel
    $item.find(".previous-selection").show().removeClass("previous-selection");
    $results.show();

    // Flexible Itinerary mode needs to show matrix
    if(isFlexItinerary) {
      $(".matrix-results").show();
    }

    // Get offset to scroll to
    var scrollTo = $item.offset().top + self.fixedOffset;

    setTimeout(function() {
      $("html, body").animate({ scrollTop : scrollTo }, 1100);
    }, 800);
  });
};


// Add taxes and update final price
flow_class.prototype.updateFinalPrice = function() {

  // Start off with 100 since that is currently a hardcoded tax
  // DEV will want to dynamically calculate all of these fields based on BR's
  var total = 100;

  $(".summary-container .flight-summary.active .summary .price-class span.price").each(function() {
    total += parseInt($(this).text());
  });

  // Update final total
  $(".finalize-step .price-total .dollars").text(total);
}

// What to do when clicking on search button
flow_class.prototype.initSearchEvents = function($el) {

  var self = this;

  // Submit Search
  $("#Search").click(function(e) {

    var isFlexible = $("#FlexCheck").is(":checked");
    var itineraryMode = Itin.itineraryMode == true;

    // Disable search button so we don't click/tap more than once
    $(this).addClass("disabled searching");

    // Make sure we are starting fresh
    self.hideAndResetSearchResults();

    // SetTimeout here to Simulate loading
    setTimeout(function() {

      // Itinerary Mode Flexible
      if(itineraryMode && isFlexible) {
        MTrix.showSearchResults();
      }
      // Itinerary Mode Non-Flexible
      else if(itineraryMode) {
        Itin.showSearchResults();
      }
      // OWC / OWD Flexible
      else if(isFlexible) {
        self.showFlexSearchResults();
      }
      // OWC / OWD Non-Flexible
      else {
        self.showSearchResults();
      }
    }, 800);
  });
};

// Call this before starting a new search query
// Hides any previous search results and resets inner containers
flow_class.prototype.hideAndResetSearchResults = function() {

  var self = this;

  // Reset flexible Search
  $(".flex-container").hide().removeClass("active");
  $(".flex-container").find(".active").removeClass("active");
  $(".flex-container").find(".open").removeClass("open fully");

  // Reset Standard Search
  $(".search-results").hide().removeClass("active").find(".active").removeClass("active");

  // Remove return flight message
  $("#choose-return-message").hide().removeClass("active");

  $(".flight-summary").hide().removeClass("active");

  // Clear Search Results that were open
  $(".search-results").removeClass("chosen active");

  $(".flexible-listing").removeClass("active").find(".active").removeClass("active");

  // Hide Next step button, No height on summary cards
  $(".summary-container").removeClass("active");

  // Continue / breakdown results
  $(".finalize-step").hide();
};

// Flexible results are slightly different than regular results
// Flex results show week view first, and have an extra level of depth
flow_class.prototype.showFlexSearchResults = function() {

  var self = this;

  // Ready to search again
  $("#Search").removeClass("disabled searching");

  var $flexContainer = $(".flex-container.depart");

  // Get the content out into the DOM
  $flexContainer.show();

  // Animate out while scrolling
  setTimeout(function() {
    $flexContainer.find(".messaging-container").addClass("active");
    $flexContainer.find(".flexible-listing").addClass("active");
  }, 800);

  // Scroll to element
  $flexContainer.velocity("scroll", { duration: 1200, easing: "ease-in-out", offset: self.fixedOffset + 1 });
};

// Show search results, reset search button, etc.
flow_class.prototype.showSearchResults = function() {

  var self = this;

  // Ready to search again
  $("#Search").removeClass("disabled searching");

  // Start with departing flight
  Flow.$allContainer = $(".all-container.depart");

  // Get into DOM
  Flow.$allContainer.show();

  // Make sure date slider is positioned properly
  $('.date-carousel').royalSlider('updateSliderSize', true);

  // Animate out while scrolling
  setTimeout(function() {
    Flow.$allContainer.addClass("active");

    Flow.$allContainer.find(".messaging-container").addClass("active");

    Flow.$allContainer.find(".flights").addClass("active");
  }, 500);

  // Scroll to element
  Flow.$allContainer.velocity("scroll", { duration: 1200, easing: "ease-in-out", offset: self.fixedOffset + 1 });
};

$(document).ready(function () {
    Flow = new flow_class();
    Flow.initPageEvents();
});
