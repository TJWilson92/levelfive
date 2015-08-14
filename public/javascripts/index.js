
// This is set in index.jade file, as comes through right away.
user = local_data

// Sort out the updating of tickets
var getTickets = function(callback){
	$.ajax({
		url: '/getTickets',
		method: 'GET',
		dataType: 'json',
		data: {user}
	}).done(function(results){
		callback(results);
	});
};

var closeTicketAjax = function(ticket_id, callback){
	$.ajax({
		url: 'tickets/studentCloseTicket',
		data: {ticketId: ticket_id},
		method: 'POST'
	}). done(function(results){
		location.reload();
	})
}

var ticketFunction = function(){
	getTickets(function(results){
		addTicketToPanel(results)
	});
};

var addTicketToPanel = function(tickets){
	totalHtml = [];
	tickets.forEach(function(curr, ind, arr){
		indTicket = [];
		indTicket.push('<tr><td>');
		indTicket.push(curr.currentQuestion);
		indTicket.push('</td><td>');
		indTicket.push('<a href="/tickets/show/' + curr._id + '">' + curr.message + '</a>');
		indTicket.push('</td><td>');
		var seen = curr.seen;
		if (seen){
			indTicket.push('Seen');
		}else {
			indTicket.push('Not Seen');
		}
		indTicket.push('</td><td>');
		indTicket.push('<button onclick=\"closeTicketAjax(\'' + curr._id + '\')\">Close Ticket</button>');
		indTicket.push('</td></tr>');
		totalHtml.push(indTicket.join(''));
	});
	$('#ticketTable').replaceWith(totalHtml.join(''));
}



// Update the ticket table every 60 seconds.
setTimeout(ticketFunction(),60000);


// Updates student's location via ajax, then hides the container.
$(document).ready(function(){
	ticketFunction();
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
		if (($('#tktQuestion').val().length > 0) & ($('#tktText').val().length > 0)){
			var tktQuestion = $('#tktQuestion').val();
			var tktText = $('#tktText').val();

			$.ajax({
				url: 'createTicket',
				method: 'POST',
				data: {tktQuestion: tktQuestion, tktText: tktText},
<<<<<<< HEAD
			}).done(function(results){
				// Clear the box
				$('#tktQuestion').val = ""
				$('#tktText').val = ""
				window.location.replace(window.location.toString() + 'tickets/show/' + results._id)
=======
			}).done(function(){
				window.reload();
>>>>>>> origin/master
			});
		} else {
			alert('Oop, we need your current quesiton, and a message for help!');
		}
	});

})
