var account_id = window.location.href.split('/').reverse()[0].toString();
// AJAX PUT to /users/toggleDemonstrator - parse account_id from URL
var toggleDemonstrator = function() {
  $.ajax({
    url: '../../users/toggleDemonstrator',
    method: 'post',
    type: 'json',
    data: {account_id: account_id}
  }).done(function(){
    document.location.reload();
  })
}

// AJAX PUT to /users/toggleAdmin - parse account_id from URL
var toggleAdmin = function() {
  $.ajax({
    url: '../../users/toggleAdmin',
    method: 'post',
    type: 'json',
    data: {account_id: account_id}
  }).done(function(){
    document.location.reload();
  })
}

$(document).ready(function(){
  $('#toggleDemonstratorButton').click(function(){
    toggleDemonstrator();
  });
  $('#toggleAdminButton').click(function(){
    toggleAdmin();
  })
})
