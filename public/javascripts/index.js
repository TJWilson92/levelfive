$(document).ready(function(){
	
	console.log(local_data);
	user = local_data

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
});