var express = require('express');
var mysql      = require('mysql');

var app = express();
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var db_host = process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost';
var db_port = process.env.OPENSHIFT_MYSQL_DB_PORT || '3306';
var db_username = process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'test';
var db_password = process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'test';
var db_url = "mysql://" + db_username + ":" + db_password + "@" + db_host + ":" + db_port;
var db_name = process.env.OPENSHIFT_APP_NAME || 'test';

var db_create_table_REPORT_LOCATIONS = {
           table_name : "REPORT_LOCATIONS",
           sql: "CREATE TABLE `REPORT_LOCATIONS` ( `ID` int(11) NOT NULL AUTO_INCREMENT, `USER` text NOT NULL, `EVENT_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `POS_X` text NOT NULL, `POS_Y` text NOT NULL, `POS_SPEED` text NOT NULL, `POS_DIR` text NOT NULL, `IP` text NOT NULL, PRIMARY KEY (`ID`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8"
};
		   

var db_connection = mysql.createConnection({
  host     : db_host,
  port     : db_port,
  user     : db_username,
  password : db_password,
  database : db_name
});

db_connection.connect();

checkTableAndCreate(db_connection,db_name,db_create_table_REPORT_LOCATIONS);

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
	  
	  var pos_x =     payload["X"] || "-1";
	  var pos_y =     payload["Y"] || "-1";
	  var pos_speed = payload["S"] || "-1";
	  var ps_direct = payload["D"] || "-1";
	  var pos_user =  payload["U"] || "-1";
	  
	  var db_values = { USER : pos_user,  POS_X : pos_x, POS_Y : pos_y, POS_SPEED : pos_speed, POS_DIR : ps_direct,  IP : host};
	  
	  var query = db_connection.query('INSERT INTO REPORT_LOCATIONS SET ?', db_values, function(err, result) {
		if (err) {
		  console.log(err);
		}
		
	  });
	  
	  
    });
    
    req.on('end', function() {
      // empty 200 OK response for now
      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      res.end( JSON.stringify(req.headers) + " / <" +  getIpFromRequest(req) + "> / " +date.toString());
    });

})

function getIpFromRequest(req) {
	var headers = req.headers;//JSON.parse(req.headers);
	var host = headers["x-forwarded-for"] || headers["x-client-ip"] || req.connection.remoteAddress;
	return host;
}

function checkTableAndCreate(connection,db_name,table_data) {
	  var tbl_count = 0;
	  var query = db_connection.query('select count(*) as CNT from information_schema.tables where upper(TABLE_SCHEMA) = upper(?) and upper(TABLE_NAME)=upper(?) ', [db_name,table_data["table_name"]], function(err, result) {
		tbl_count = ((result[0].CNT));
		console.log(tbl_count);
		if (err) {
		 console.log(err);
		 tbl_count = -1;
	    } else {
		  if ( tbl_count == 0 ) {
			  var query = db_connection.query(table_data["sql"], function(err, result) {
				if (err) {
				 console.log(err);
				}
			  });
		  }
		}

		
		
	  });
	  console.log(tbl_count);

}

app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);