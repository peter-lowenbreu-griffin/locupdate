var express = require('express');
var app = express();
var LISTEN_PORT = 8080;


app.get('/', function (req, res) {
	var date = new Date();
   res.end( date.toString() );
})


var server = app.listen(LISTEN_PORT, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})