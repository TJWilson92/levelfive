var ticket_id = window.location.href.split('/').reverse()[0].toString()

var getComments = function(callback){
  $.ajax({
    url: '../../comments/get_comments',
    method: 'get',
    type: 'json',
    data: {ticket_id: ticket_id},
  }).done(function(results){
    callback(results);
  })
}
// changes
var print_comments = function(json_data){
  final_html = []
  json_data.forEach(function(cur, ind, arr){
    tmp = []
    tmp.push('<div class="panel panel-default"><div class="panel-heading"><h5>Comment From: ')
    tmp.push(cur.account.firstname)
    tmp.push(' ')
    tmp.push(cur.account.surname)
    tmp.push('</h5></div><div class="panel-body"><p>')
    tmp.push(cur.text)
    tmp.push('</p></div></div>')
    final_html.push(tmp.join(''));
    console.log(tmp);
  })
  document.getElementById('ticket_comments').innerHTML = final_html.join('');
}

getComments(function(results){
  print_comments(results);
})

window.setInterval(function(){
  getComments(function(results){
    print_comments(results);
  })
}, 50000);
