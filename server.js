// Config //
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mysql = require("mysql"),
    PythonShell = require("python-shell");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.set("view engine", "ejs");

// Python Script //

// PythonShell.run('my_script.py', function (err) {
//   if (err) throw err;
//   console.log('finished');
// });

// Routes //

app.get("/", function(req, res){
  res.render("index.ejs");
});

app.listen(process.env.port || 3000);
