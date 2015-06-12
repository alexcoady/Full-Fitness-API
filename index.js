// Dependencies
var express         = require("express");
var _               = require("lodash");
var db              = require("./db");

var app             = express();

// App settings
app.set( "view engine", "jade" );
app.set( "views", "webapp/views/" );

app.locals._ = _;

// This should always be the last middleware function (handles all errors)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, "Something broke (check terminal)");
});

/* MIDDLEWARE STOPS HERE */
app.use("/public", express.static(__dirname + "/../public/"));


// Routers
app.use( "/exercises", require("./exercise/router") );
app.use( "/workouts", require("./workout/router") );

// Start the server
app.listen( 3000, function () {
  console.log("Server: Server started, bitches!");
});
