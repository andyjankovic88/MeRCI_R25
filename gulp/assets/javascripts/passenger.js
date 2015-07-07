// Basic Passenger toggle functionality
$(document).ready(function() {

  $(".passenger-list li .line-item").click(function() {
    $(this).parent().find(".content").slideToggle(600);
  });


  // Same as primary passenger
  // Clicking on should copy all details from passenger one's form to this one
  $("#SameAsPrimary").on("change", function() {

    // Don't do anything if we unchecked it
    if(!$(this).is(":checked")) {
      return;
    }

    var $primaryForm = $(".primary-passenger .form-address-container input, .primary-passenger .form-address-container select");
    var $thisForm = $(this).closest(".additional-passenger");

    $primaryForm.each(function() {

        var id = $(this).attr("id");
        var $el = $thisForm.find("#" + id);

        // Selects need to grab the option value
        if($el.is("select")) {
          var val = $(this).find("option:selected").val();
          $el.val(val);
        }
        else {
          $el.val($(this).val());
        }
    });
  });
});
