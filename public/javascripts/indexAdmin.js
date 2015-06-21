$(document).ready(function(){
	
	var adminGetTickets = function (ticket_url, callback) {
		$.ajax({
			url: '/getTicketsUnseen',
			method: 'GET', 
			data: {
				ticketType: ticket_url,
			}
		}).done(function(results){
			callback(results);
		});
	};


	// Tickets is the returned JSON data from ajax
	// Table is the name of the html element where the table rows need to go
	// Type is the kind of tickets they are, possibilities: "Open", "Unseen", "Closed"
	var addTicketToPanel = function(tickets, table, type){
		var newCol = '</td><td>';
		totalHtml = [];
		// Check the table we're filling in

		// "Unseen takes order: Student, Question, Message, Time, /mark as seen/, /change status/
		if (type == "Unseen") {
			// Ticket takes order: Student name (email), question, message, date, _id
			tickets.forEach(function(curr, ind, array){
				indTicket = [];
				indTicket.push('<tr><td>');
				indTicket.push(curr[0]);
				indTicket.push(newCol);
				indTicket.push(curr[1]);
				indTicket.push(newCol);
				indTicket.push(curr[2]);
				indTicket.push(newCol);
				indTicket.push(curr[3]);
				indTicket.push(newCol);
				indTicket.push('<button onclick="markAsSeen(\'' + curr[4] + '\')" class="btn btn-primary">Seen</button>')
				indTicket.push(newCol);
				// promptForStatus() is defined in index.jade as needs to be accessible.
				indTicket.push('<button onclick="promptForStatus(\'' + curr[4] + '\')" class="btn btn-primary">Update</button>')
				indTicket.push('</td></tr>');
				totalHtml.push(indTicket.join(''));

				if (ind == array.length - 1) {
					console.log(totalHtml);
					$(table).replaceWith(totalHtml.join(''));
				}
			})	
		} else if (type == "Seen") {
			// Ticket takes order: Student name (email), question, message, date, _id
			tickets.forEach(function(curr, ind, array){
				indTicket = [];
				indTicket.push('<tr><td>');
				indTicket.push(curr[0]);
				indTicket.push(newCol);
				indTicket.push(curr[1]);
				indTicket.push(newCol);
				indTicket.push(curr[2]);
				indTicket.push(newCol);
				indTicket.push(curr[3]);
				indTicket.push(newCol);
				indTicket.push('<button onclick="markAsClose(\'' + curr[4] + '\')" class="btn btn-primary">Close</button>')
				indTicket.push(newCol);
				// promptForStatus() is defined in index.jade as needs to be accessible.
				indTicket.push('<button onclick="promptForStatus(\'' + curr[4] + '\')" class="btn btn-primary">Update</button>')
				indTicket.push('</td></tr>');
				totalHtml.push(indTicket.join(''));

				if (ind == array.length - 1) {
					console.log(totalHtml);
					$(table).replaceWith(totalHtml.join(''));
				}
			})	
		};
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

	// Get all those tickets which are open and unseen
	var unseenTkts = function(){
		// Submit AJAX get request for getTicketsUnseen
		// This returns an array of tickets, configured to work with the tabe
		// Row order: Student, Question, Message, Time, /mark as seen/, /change status/
		adminGetTickets('Unseen', function(results){
			addTicketToPanel(results, '#unseenTicketsTable', 'Unseen');
		});
	}

	var seenTkts = function(){
		adminGetTickets('Seen', function(results){
			addTicketToPanel(results, '#seenTicketsTable');
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

	$('#seenTickets').click(function(){
		seenTkts();
	})
	
});