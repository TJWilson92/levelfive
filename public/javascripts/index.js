$(document).ready(function(){
	console.log(local_data)
	user = local_data

	$('#locationButton').click(function(){
		if($('#locationBar').val().length > 1) {
			user.location = $('#locationBar').val();
			user.save(function(err){
				if (err) console.log(err);
				alert('Your new location is ' + $('#locationBar').val());
			});
		} else {
			alert('Please enter a location');
		}
	});
});