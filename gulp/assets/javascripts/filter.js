/* -- Filter Class is in charge of handling flight filters - price, stops, etc -- */
filter_class = function () {

};

filter_class.prototype.initPageEvents = function() {

  // Show filter screen
  $("a.filter-results").click(function(e) {
    e.preventDefault();
    var isOutbound = $(this).attr("data-inout") == "outbound";

    // Show filter screen
    $("#FilterPanel").toggleClass("active");
  });

  // Close filter panel
  $(".close-panel").click(function(e) {
    e.preventDefault();

    $("#FilterPanel").removeClass("active");
  });
};


$(document).ready(function () {
    Filter = new filter_class();
    Filter.initPageEvents();
});
