var express = require('express');
var app = express();
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


app.get('/', function (req, res) {
	var date = new Date();
	
	
    req.on('data', function(chunk) {
      console.log("Received body data:");
      console.log(chunk.toString());
    });
    
    req.on('end', function() {
      // empty 200 OK response for now
      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      res.end(date.toString());
    });

})

app.post('/', function (req, res) {
	var date = new Date();
	var host;
	console.log("X " + req.connection.remoteAddress);
    req.on('data', function(chunk) {
      console.log("Received body data:");
      console.log(chunk.toString());
	  var payload = JSON.parse(chunk.toString());
	  
	  var headers = req.headers;//JSON.parse(req.headers);
	  
	  host = headers["x-forwarded-for"] || headers["x-client-ip"] || req.connection.remoteAddress;
	  console.log(host);
	  
    });
    
    req.on('end', function() {
      // empty 200 OK response for now
      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      res.end( JSON.stringify(req.headers) + " / <" +  host + "> / " +date.toString());
    });

})


app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);