$(document).ready(function(){
	
	var adminGetTickets = function (ticket_url, callback) {
		$.ajax({
			url: '/getTickets' + ticket_url,
			method: 'get'
		}).done(function(results){
			callback(results);
		});
	};

	// Tickets is the returned JSON data from ajax
	// Table is the name of the html element where the table rows need to go
	// Type is the kind of tickets they are, possibilities: "Open", "Unseen", "Closed"
	var addTicketToPanel = function(tickets, table, type){
		totalHtml = [];
		// For each item in the JSON results
		tickets.forEach(function(curr, ind, arr){
			indTicket = [];
			// Make new row
			indTicket.push('<tr><td>');
			indTicket.push('')
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
			indTicket.push('</td><td>');
			indTicket.push('<form method="post" action="tickets/studentCloseTicket"><button type="submit" name="ticketId" value="' + curr._id + '">Close</button></form>');
			indTicket.push('</td></tr>');
			totalHtml.push(indTicket.join(''));
		});
		$('#ticketTable').replaceWith(totalHtml.join(''));
	}

	
	var adminWriteToTable = function(results, table){

	}

	var unseenTkts = function(){
		adminGetTickets('Unseen', function(results){
			console.log(results);
		});
	}

	var seenTkts = function(){
		adminGetTickets('getSeenTickets', function(results){

		})
	}

	var ticketFunction = function(){

		getTickets(function(results){
			addTicketToPanel(results)
		});
	};

	$('#unseentickets').click(function(){
		unseenTkts();
	})
	
});