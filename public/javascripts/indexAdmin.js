markAsSeen = function(ticketId){
  $.ajax({
	    url: '/tickets/markAsSeen',
	    method: 'post',
	    data: {ticket_id: ticketId},
	    dataType: 'json'
	});
  seenTkts();
  unseenTkts();
  document.location.reload();
}

markAsClosed = function(ticketId){
  $.ajax({
    url: '/tickets/markAsClosed',
    method: 'post',
    data: {ticket_id: ticketId},
    dataType: 'json'
  });
  closedTkts();
  seenTkts();
  document.location.reload();
}

var promptForStatus = function(ticketId){
  console.log('Called promptForStatus');
  var newStatus = prompt("Enter new Ticket Status");
  if (newStatus != null) {
    $.ajax({
      url: '/tickets/updateTicketStatus',
      method: 'post',
      dataType: 'json',
      data: {
        ticket_id: ticketId,
        statusUpdate: newStatus
      }
    }).done(function(){
      console.log('Made Ajax call');
    });
  } else {
    alert('Invalid Status');
  }
}


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
	var isEndOfTickets = function(index, ar, table, html) {

		if (index == ar.length -1 ) {
			console.log(html);
			document.getElementById(table).innerHTML = html.join('').toString();
		};
	}

	if (tickets == "No Tickets") {
		$(table).replaceWith('');
		return null;
	} else {
		var newCol = '</td><td>';
		var totalHtml = [];
		// Check the table we're filling in

		// "Unseen takes order: Student, Question, Message, Time, /mark as seen/, /change status/
		if (type == "Unseen") {
			// Ticket takes order: Student name (email), question, message, date, _id
			tickets.forEach(function(curr, ind, array){
				var indTicket = [];
				indTicket.push('<tr><td>');
				indTicket.push(curr[0]);
				indTicket.push(newCol);
        indTicket.push('<a href="tickets/show/' + curr[4] + '">')
				indTicket.push(curr[1]);
        indTicket.push('</a>');
				indTicket.push(newCol);
				indTicket.push(curr[2]);
				indTicket.push(newCol);
				indTicket.push(curr[3]);
				indTicket.push(newCol);
				indTicket.push('<button onclick="markAsSeen(\'' + curr[4] + '\')" class="btn btn-primary">Seen</button>');
				indTicket.push('</td></tr>');
				totalHtml.push(indTicket.join(''));

				isEndOfTickets(ind, array, table, totalHtml);
			});
		} else if (type == "Seen") {
			// Ticket takes order: Student name (email), question, message, date, _id
			tickets.forEach(function(curr, ind, array){
				var indTicket = [];
				indTicket.push('<tr><td>');
				indTicket.push(curr[0]);
				indTicket.push(newCol);
        indTicket.push('<a href="tickets/show/' + curr[4] + '">')
				indTicket.push(curr[1]);
        indTicket.push('</a>');
				indTicket.push(newCol);
				indTicket.push(curr[2]);
				indTicket.push(newCol);
				indTicket.push(curr[3]);
				indTicket.push(newCol);
				indTicket.push('<button onclick="markAsClosed(\'' + curr[4] + '\')" class="btn btn-primary">Close</button>')
				indTicket.push('</td></tr>');
				totalHtml.push(indTicket.join(''));

				isEndOfTickets(ind, array, table, totalHtml);
			});
		}
	}
};


var adminWriteToTable = function(results, table){

}

// Get all those tickets which are open and unseen
var unseenTkts = function(callbacks){
	// Submit AJAX get request for getTicketsUnseen
	// This returns an array of tickets, configured to work with the tabe
	// Row order: Student, Question, Message, Time, /mark as seen/, /change status/
	adminGetTickets('Unseen', function(results){
    if (results.length != 0) {
      addTicketToPanel(results, 'unseenTicketsTable', 'Unseen');
    }
	});
}

var seenTkts = function(callbacks){
	adminGetTickets('Seen', function(results){
		document.getElementById('seenTicketsTable').innerHTML = "Loading";
		addTicketToPanel(results, 'seenTicketsTable', "Seen");
	});
}

var ticketFunction = function(){

	getTickets(function(results){
		addTicketToPanel(results)
	});
};

$(document).ready(function(){
	$('#unseentickets').click(function(){
		unseenTkts();
	});

	$('#seenTickets').click(function(){
		seenTkts();
	});

  unseenTkts();
  seenTkts();

	window.setInterval(function(){
		unseenTkts();
		seenTkts();
	}, 10000);

})
