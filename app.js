// Config //
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mysql = require('mysql'),
    PythonShell = require('python-shell');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.set('view engine', 'ejs');


// Database //

var con = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database : 'my_db'
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to DB');
    return;
  } console.log('Connection established');
});

con.end(function(err) {});


// Python Script //

PythonShell.run('my_script.py', function (err) {
  if (err) throw err;
  console.log('Ran python script');
});


// Routes //

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.listen(process.env.port || 3000);
