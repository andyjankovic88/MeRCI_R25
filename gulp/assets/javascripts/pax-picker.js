$(document).ready(function () {

	$('#pax-picker__widget button').click(function(e){

	  e.stopPropagation();

	  if($(this).text() == '+'){
	    $( this ).prev().text(function(){
	      $('#count-person').text(parseInt($('#count-person').text().split(' ')[0], 10) + 1 + ' Person');
	      return parseInt($( this ).text(), 10) + 1;
	    });
	  }else if($(this).text() == '-'){
	    $( this ).next().text(function(){      
	      if(parseInt($( this ).text(), 10) == 0){
	        alert('Decrease Error');
	      }else{
	        $('#count-person').text(parseInt($('#count-person').text().split(' ')[0], 10) - 1 + ' Person');
	        return parseInt($( this ).text(), 10) - 1; 
	      }
	    });
	  }

	  $('.pax-picker__section input:radio').change(function(){
	    $('#cabin-value').text($(this).val());
	  });

	});

});