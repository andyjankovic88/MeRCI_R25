$(document).ready(function() {

  // On Payment Type Select
  $("#SharingMethod").change(function() {

    // Let CSS know we chose something
    $("body").addClass("sharing-selected");

    // Hide / Show relevant panels
    var section = $("#SharingMethod option:selected").val();
    var $section = $(section);

    // Hide previous active
    $(".method-section:visible").hide();

    // Show and scroll to new section
    $section.show().velocity("scroll", { duration: 800, easing: "ease-in-out", delay: 300, offset: -55 });;

  });

});
