// This class is responsible for handling itinerary mode interactions
matrix_class = function () {

};

matrix_class.prototype.initPageEvents = function() {

  // Click on price element to make it active, then scroll to flight selection
  $("table.matrix tbody td").click(function() {
    var price = $(this).find("span.price span").text();

    // Set item as active
    $(this).closest("table.matrix").find("td.active").removeClass("active");
    $(this).addClass("active");

    // Wait a bit, then show results
    setTimeout(function() {
      Itin.showSearchResults();
    }, 400);

    // scroll to results
    //$("table.matrix tbody").scrollTo( '50%', {axis: 'x'} );

    // $.scrollTo(".matrix-results");


  });
};

matrix_class.prototype.showSearchResults = function() {

  // We can start a new search again
  $("#Search").removeClass("disabled searching");

  // Start with departing results
  $(".matrix-results.depart").show(400);

  // Show messaging
  $(".matrix-results .messaging-container").addClass("active");


  // On Show complete
  setTimeout(function() {

    $.scrollTo(".matrix-results", { duration: 800, offset: 0 } );

    // Center the results
    $("table.matrix tbody").scrollTo( '50%', {axis: 'x'} );

  }, 400);
};

$(document).ready(function () {
    MTrix = new matrix_class();
    MTrix.initPageEvents();
});
