// Config //
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    PythonShell = require('python-shell'),
    sqli = require('sqli'), 
    sqlite = sqli.getDriver('sqlite'),
    conn = sqlite.connect('db/rep_zone.db');

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

// PythonShell.run('my_script.py', function (err) {
//   if (err) throw err;
//   console.log('Ran python script');
// });


// Routes //

app.get('/newyork', function(req, res){
  // res.render('index.ejs');
  conn.exec('SELECT * FROM current_rep_bio WHERE state = "NY"').each(function(row){
    res.json(row);
  });
});

app.listen(process.env.port || 3000);




