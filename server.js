var express = require('express');
var app = express();
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


app.get('/', function (req, res) {
	var date = new Date();
   res.end( date.toString() );
})


app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);