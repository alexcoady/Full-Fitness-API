// NPM dependencies
var express = require("express");

// App dependencies
var ExerciseModel   = require("./exerciseModel").Model;
var ExerciseTypeModel   = require("./exerciseTypeModel").Model;

var router = new express.Router();

router.get("/:exerciseSlug", function ( req, res ) {

  var exerciseSlug = req.params.exerciseSlug;

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

router.get("/", function ( req, res ) {

  ExerciseModel.find({}).exec(function ( err, exercises ) {

    if ( err ) return res.status(500).send(err);

    res.jsonp( exercises );
  });
});


module.exports = router;
