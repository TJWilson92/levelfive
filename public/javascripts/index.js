$(document).ready(function(){
	user = local_data

	var getTickets = function(callback){
		$.ajax({
			url: '/getTickets',
			method: 'GET',
		}).done(function(results){
			callback(results);
		});
	};

	var addTicketToPanel = function(tickets){
		totalHtml = [];
		tickets.forEach(function(curr, ind, arr){
			indTicket = [];
			indTicket.push('<tr><td>');
			indTicket.push(curr.currentQuestion);
			indTicket.push('</td><td>');
			indTicket.push(curr.message);
			indTicket.push('</td><td>');
			var seen = curr.seen;
			if (seen){
				indTicket.push('Seen');
			}else {
				indTicket.push('Not Seen');
			}
			indTicket.push('</td></tr>');
			totalHtml.push(indTicket.join(''));
		});
		$('#ticketTable').replaceWith(totalHtml.join(''));
	}
	
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

		getTickets(function(results){
			addTicketToPanel(results);
		});
		
		
	});

});