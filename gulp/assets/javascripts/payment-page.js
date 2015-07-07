$(document).ready(function() {

  // Generic credit card validation
  $(".cc-number").payment('formatCardNumber');

  // On Payment Type Select
  $("#PaymentType").change(function() {

    // Let CSS know we chose something
    $(".booking-flow").addClass("payment-selected");

    // Hide / Show relevant panels
    var section = $("#PaymentType option:selected").val();
    var $section = $(section);

    // Hide previous active
    $(".payment-section:visible").hide();

    // Show and scroll to new section
    $section.show().velocity("scroll", { duration: 800, easing: "ease-in-out", delay: 300, offset: -55 });;
  });

  // Promo Code Button Placeholder
  $("#CheckPromo").click(function(e) {
    e.preventDefault();
    $("#PromoMessage").show(500);

    // Update trip summary bar
    Summary.updatePrice(599);
  });

  //Overlay Sharing
  $("a.sharetrip").click(function(e) {
    e.preventDefault();
    $(".overlay.sharing").addClass("active");
  });


});
