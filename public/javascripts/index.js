$(document).ready(function(){
	user = local_data

	var getTickets = function(){
		$.ajax({
			url: '/getTickets',
			method: 'GET',
		}).done(function(results){
			$('#ticketResultsHere').append(JSON.stringify(results));
		});
	};

	var drawStudentTickets = function(tickets, divName) {
		var results = [];
		tickets.forEach(function(val, ind, array){
			indTicket = [];
			indTicket.push("<div class='panel panel-default> <div class='panel-heading'> <h2> Ticket </h2> </div> <div class='panel-body'>")
			indTicket.push("<b>Question: </b>" + val.currentQuestion.toString() + "<br/>");
			indTicket.push("<b>Message: </b>" + val.message.toString() + "<br/>");

			if (val.seen == true) {
				indTicket.push("<b>Status: </b> Seen")
			} else {
				indTicket.push("<b>Status: </b> Unseen")
			}
			results.push(indTicket);
		});
		return results;
	};


	

	$('#locationButton').click(function(){
		var val = document.getElementById('locationBar').value
		if (val.length > 0) {
			$.ajax({
				url: 'updateLocation',
				method: 'POST',
				data: {account: user, newLocation: val},
			}).done(function(){
				$('#locationBox').hide( 'drop', {direction: 'down'}, 'slow')
			});
		} else {
			alert('Please enter a location!')
		}
	});

	$('#tktSubmit').click(function(){
		// Check that that the student has entered something.

		if (($('#tktQuestion').val().length > 0) & ($('#tktText').val().length > 0)){
			var tktQuestion = $('#tktQuestion').val();
			var tktText = $('#tktText').val();
			$.ajax({
				url: 'createTicket',
				method: 'POST',
				data: {tktQuestion: tktQuestion, tktText: tktText},
			}).done({

			})
		} else {
			alert('Oop, we need your current quesiton, and a message for help!');
		}
	});

	

	$('#getTicketsBtn').click(function(){
		getTickets();
		// alert('hi');
	});

});