// This class is responsible for page transitions
transition_class = function () {
  this.currentPage = "passenger";

  // Location of the search page
  // When the user clicks on step1 within the booking flow, they are taken here
  this.searchPageUrl = "/";

  // ms in which sliding transition takes place
  // this should typically be greater than or equal to the css transform transition property
  this.transitionSpeed = 750;

  // Cache selectors
  this.$flow = $(".booking-flow");
  this.$sectionContainer = $(".section-container");
  this.$tripSummaryContent = $("#trip-summary-content");
  this.$crumbs = $("nav.breadcrumbs");
};

  // ms in which to open trip summary on page arrival
  this.summaryDelay = 500;

transition_class.prototype.initPageEvents = function() {

  var self = this;

  // Transition to page based on anchor / breadcrumb query selector
  $('a[data-page], .breadcrumbs li[data-page]').click(function(e) {

    e.preventDefault();

    var page = $(this).attr("data-page");

    self.changePage(page);
  });

  // Back button
  $("#Backflow").click(function(e) {
    e.preventDefault();

    // Go back in history
    var iCurrentPage = $(".section-container > section.active").index();
    var $nextPage = $(".section-container > section:nth-child(" + (iCurrentPage) +")");
    var nextPage = $nextPage.attr("data-page");

    // Check if going back to search
    nextPage = iCurrentPage == 0 ? "search" : nextPage;


    self.changePage(nextPage);

    // Always Make sure Trip Summary bar is closed on back button
    var $tripSummary = $("#trip-summary-content");
    if($tripSummary.is(":visible")) {
      Summary.openSummaryBar(true);
    }
  });
};

// Changes page using a transition
// @params : page - string of page to transition to. ex: "#passengers"
// @params : bPushHistory (default : true) - whether to push to the html5 history stack or not
transition_class.prototype.changePage = function(page, bPushHistory) {

  var self = this;
  bPushHistory = typeof bPushHistory !== 'undefined' ? bPushHistory : true;
  var $currentPage = self.$sectionContainer.find(".page-transition.active");
  var currentIndex = $currentPage.index();
  page = typeof page != "undefined" ? page.replace("#", "") : ""; // Make sure we're not looking at a hash
  page = page == "" ? "passenger" : page; // empty string should go back to passenger page
  var $nextPage = self.$sectionContainer.find(".page-transition[data-page='" + page + "']");
  var nextIndex = $nextPage.index();

  // Transition right-to left inseat of l-r if we're going back a section
  var goForwards = nextIndex > currentIndex;

  // Don't do anything if we're already on this page
  if(nextIndex == currentIndex && page.length > 0) {
    return;
  }

  // Switch to new page if it's not search
  // If it's search, we will confirm with user before redirecting
  if(page != "search" && page.length > 0) {

    // Prep the new page's visibility and positioning
    if(goForwards) {
      // Make sure we're scrolled to the top
      $(window).scrollTop(0);

      // requestAnimationFrame(function() {
        //Prep positioning and DOM
        $nextPage.addClass("active");

        // Kick off the transition
        self.$sectionContainer.addClass("transitioning forwards");
      // });

      // Make sure our scrollbar is all the way to the left during transition
      self.$flow.scrollLeft(0);
    }
    else {
      $nextPage.addClass("active");

      self.$sectionContainer.addClass("goingBack");

      // Make sure we're scrolled to the top
      $(window).scrollTop(0);

      self.$sectionContainer.addClass("transitioning backwards")
    }

    // Update breadcrumbs
    self.updateCrumbs(page);

    // Once we're done switching the page in the next step we need to let the container update
    // This essentially hides non-active pages from the DOM
    setTimeout(function() {
      self.$sectionContainer.removeClass("transitioning").removeClass("forwards backwards goingBack");

      $currentPage.removeClass("active");

      // Since we are going forward, push into history stack
      if(bPushHistory) {
        FlowHistory.push({ page: "#" + page }, "/booking#" + page);
      }
    }, self.transitionSpeed);

    // Open up trip summary bar for review page
    // wait a bit before firing
    if(page == "review") {
      setTimeout(function() {
        $("#trip-summary .title").click();
      }, self.summaryDelay + self.transitionSpeed);
    }
    else {
      // Make sure trip summary bar is closed
      if(self.$tripSummaryContent.is(":visible")) {
        // Close the summary bar via boolean
        Summary.openSummaryBar(true);
      }
    }
  }
  else {
    if (confirm('Return to Search Results?')) {
      window.location = "/";
    }
  }
};

transition_class.prototype.updateCrumbs = function(page) {

  // Grouping these two together for now
  if(page == "passengerAdditional") {
    page = "passenger";
  }

  // Update list item as active
  this.$crumbs.find("> ul > li.active").removeClass("active").parent().find("li[data-page='" + page + "']").addClass("active");;
};


$(document).ready(function () {
    Tran = new transition_class();
    Tran.initPageEvents();
});
