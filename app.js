// Config //
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    PythonShell = require('python-shell'),
    sqli = require('sqli'), 
    sqlite = sqli.getDriver('sqlite'),
    conn = sqlite.connect('rep_zone.db');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.set('view engine', 'ejs');

// Database

// conn.exec('SELECT * FROM current_rep_bio WHERE state = "CA"').each(function(row){
//   console.log(row);
// });


// Python Script //


//start.js
var spawn = require('child_process').spawn,
    py    = spawn('python', ['python/get_senator_by_zip.py']),
    data = 11238,
    dataString = '';

py.stdout.on('data', function(data){
  dataString += data.toString();
});

py.stdout.on('end', function(){
  console.log(dataString.replace('\n', ''));
});

py.stdin.write(JSON.stringify(data));

app.get('/', function(req, res){
  conn.exec('SELECT  * FROM current_rep_bio WHERE state ="' + 
    dataString.replace('\n', '') + '"').all(function(row){
    res.json(row);
    /*console.log(row)*/
  })
});


py.stdin.end();

/*change*/



app.listen(process.env.port || 3000);




