// Dependencies
var express         = require("express");
var bodyParser      = require("body-parser");
var cookieParser    = require("cookie-parser");
var methodOverride  = require("method-override");
var _               = require("lodash");
var db              = require("./db");
var ExerciseModel   = require("./exercise/exerciseModel").Model;
var ExerciseTypeModel   = require("./exercise/exerciseTypeModel").Model;
var app             = express();

// App settings
app.set( "view engine", "jade" );
app.set( "views", "webapp/views/" );


// This should always be the last middleware function (handles all errors)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, "Something broke (check terminal)");
});

/* MIDDLEWARE STOPS HERE */
app.use("/public", express.static(__dirname + "/../public/"));

_.extend( app.locals, {
    _:          _,
});

app.get("/exercise/:exerciseSlug", function ( req, res ) {

  var exerciseSlug = req.params.exerciseSlug;

  console.log(exerciseSlug)

  ExerciseTypeModel.findOne({ slug: exerciseSlug }, function ( err, foundType ) {

    if ( err ) return res.status(500).send(err);
    if ( !foundType ) return res.send(404);

    ExerciseModel.find({
      "exercise": foundType
    }).exec(function ( err, foundExercises ) {

      if ( err ) return res.status(500).send(err);

      res.jsonp({
        exercises: foundExercises,
        exerciseType: foundType
      });
    });
  });
});

app.get("/", function ( req, res ) {

  ExerciseModel.find({}).exec(function ( err, exercises ) {

    if ( err ) return res.status(500).send(err);

    res.jsonp( exercises );
  });
});

// Start the server
app.listen( 3000, function () {

    console.log("Server: Server started, bitches!");
});
