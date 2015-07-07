/* -- The History Class handles back / forward functionality -- */
// @BGLR - This may be replaced by Aria Template functinality, and is intended as a working example of how to implement this functionality
history_class = function () {

};

history_class.prototype.initPageEvents = function() {

  // Handle Back / Forward functionality
  window.addEventListener('popstate', function(event) {
    var page = document.location.hash;

    Tran.changePage(page, false);
  });

  // On first page load, check hash and see if we need to go back to a page
  $(window).load(function() {

    var currentState = history.state;
    if(currentState != null) {

      // give enough time for initial page transition to complete
      setTimeout(function() {
        Tran.changePage(currentState.page, false);
      }, 100)
    }
  });
}

history_class.prototype.push = function(oData, href, title) {

  // Push onto the stack
  title = title || null;

  window.history.pushState(oData, title, href);
}

$(document).ready(function () {
    FlowHistory = new history_class();

    // Only init if we are in the booking flow area
    if($(".booking-flow").length > 0) {
      FlowHistory.initPageEvents();
    }
});
