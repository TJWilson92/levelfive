var account_id = window.location.href.split('/').reverse()[0].toString();
// AJAX PUT to /users/toggleDemonstrator - parse account_id from URL
var toggleDemonstrator = function() {
  $.ajax({
    url: '../../users/toggleDemonstrator',
    method: 'get',
    type: 'json',
    data: {account_id: account_id}
  }).done(function(){
    Location.reload();
  })
}

// AJAX PUT to /users/toggleAdmin - parse account_id from URL
var toggleDemonstrator = function() {
  $.ajax({
    url: '../../users/toggleAdmin',
    method: 'get',
    type: 'json',
    data: {account_id: account_id}
  }).done(function(){
    Location.reload();
  })
}
