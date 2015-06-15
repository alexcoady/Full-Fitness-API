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


/**
 *
 *
 *  @method byExerciseName
 *  @param {Type} name desc
 *  @return {Type}
 */
function byExerciseName ( set ) {
  return set.exercise && set.exercise.name;
}


/**
 *  Removes fields that do not need to be sent to the client
 *
 *  @method reduceSet
 *  @param {Object} set A single set
 *  @return {Object} simple set
 */
function reduceSet ( set ) {
  return {
    weight: set.weight,
    reps: set.reps
  }
}


/**
 *  The exercise type is stripped out of the first set provided.
 *  This method can assume that all sets form the same exercise.
 *
 *  @method composeWorkoutObject
 *  @param {[Object]} sets Raw set objects
 *  @return {Object} exercise object the client will recieve
 */
function composeExerciseObject ( sets ) {
  return {
    exercise: sets[0].exercise,
    sets: _.map( sets, reduceSet )
  };
}


/**
 *  Creates a "workout" from a list of sets that ends up having
 *  a date and a series of exercises
 *
 *  @method composeWorkoutObject
 *  @param {[Object]} setsInWorkout raw set objects in a workout
 *  @param {String} date String representing a date
 *  @return {Object} workout object
 */
function composeWorkoutObject ( setsInWorkout, date ) {

  var exercises = _.map(_.groupBy( setsInWorkout, byExerciseName ), composeExerciseObject );

  return {
    date: date,
    exercises: exercises
  };
}

router.get("/", function ( req, res ) {

  ExerciseModel.find({
    date: { "$ne": null }
  }).lean().populate("exercise").exec(function ( err, allSets ) {

    if ( err ) return res.status(500).send(err);

    var workouts = _.map(_.groupBy( allSets, "date" ), composeWorkoutObject );

    res.jsonp( workouts );
  });
});


module.exports = router;
