// NPM dependencies
var express = require("express");
var _ = require("lodash");

// App dependencies
var ExerciseModel   = require("./../exercise/exerciseModel").Model;
var ExerciseTypeModel   = require("./../exercise/exerciseTypeModel").Model;

var router = new express.Router();

router.get("/:workoutDate", function ( req, res ) {

  // var exerciseSlug = req.params.exerciseSlug;
  //
  // ExerciseTypeModel.findOne({ slug: exerciseSlug }, function ( err, foundType ) {
  //
  //   if ( err ) return res.status(500).send(err);
  //   if ( !foundType ) return res.send(404);
  //
  //   ExerciseModel.find({
  //     "exercise": foundType
  //   }).exec(function ( err, foundExercises ) {
  //
  //     if ( err ) return res.status(500).send(err);
  //
  //     res.jsonp({
  //       exercises: foundExercises,
  //       exerciseType: foundType
  //     });
  //   });
  // });

  res.status(500).jsonp({
    message: "Route not implemented"
  })
});

router.get("/", function ( req, res ) {

  ExerciseModel.find({
    date: { "$ne": null }
  }).lean().populate("exercise").exec(function ( err, allSets ) {

    if ( err ) return res.status(500).send(err);

    // Group all sets into workouts by date
    var workouts = _.map(_.groupBy( allSets, "date" ), function ( setsOnDate, date ) {

      // Group all sets within a date by the exercise
      var exercises = _.map(_.groupBy( setsOnDate, function (set) {

        return set.exercise && set.exercise.name;

      }), function ( sets, exerciseName ) {

        var exercise = sets[0].exercise;

        // Reduce set information to remove properties held by parents
        var sets = _.map( sets, function ( set ) {

          return {
            weight: set.weight,
            reps: set.reps
          };
        });

        return {
          exercise: exercise,
          sets: sets
        };
      });

      return {
        date: date,
        exercises: exercises
      };
    });

    res.jsonp( workouts );
  });
});


module.exports = router;
