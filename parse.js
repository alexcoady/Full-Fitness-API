var fs = require("fs");
var parse = require("csv-parse");
var transform = require("stream-transform");
var _ = require("lodash");
var slug = require("slug");

require("./db");
var ExerciseModel = require("./exercise/exerciseModel").Model;
var ExerciseTypeModel = require("./exercise/exerciseTypeModel").Model;


(function () {

  fs.readFile( "data/jan.csv", "utf8", function ( err, data ) {

    if ( err ) return console.error( err );

    parse( data, function ( err, content ) {
      if ( err ) return console.error( err );
      handleContent( content );
    });
  });


  function addToDatabase ( types, exercises ) {

    createExerciseTypeModels( types, function () {

      createExerciseModels( exercises, function () {

        console.log("we're done here");
      });
    });
  }


  function createExerciseTypeModels ( exerciseTypes, callback ) {

    // First, get ALL current exerciseTypes
    ExerciseTypeModel.find().exec(function ( err, foundTypes ) {

      var pluckedTypes = _.pluck( foundTypes, "name" );
      var cache = [];
      var newTypes = [];

      if ( err ) return console.log( err );

      newTypes = _.uniq(_.compact(_.map( exerciseTypes, function ( type ) {

        // Check if type aleady exists
        if ( pluckedTypes.indexOf( type ) !== -1 ) return null;
        if ( cache.indexOf( type ) !== -1 ) return null;

        cache.push(type);

        return {
          name: type,
          slug: slug(type)
        };
      })));

      ExerciseTypeModel.create( newTypes, function ( err, models ) {

        if ( err ) return console.error( err );

        console.log( "%s exercise type models added!", models && models.length || 0 );

        if ( _.isFunction(callback) ) callback();
      });

    });
  }


  function createExerciseModels ( exercises, callback ) {

    ExerciseTypeModel.find(function ( err, foundTypes ) {

      if ( err ) return console.error( err );

      exercises = _.map( exercises, function ( exercise ) {
        exercise.exercise = _.find( foundTypes, { name: exercise.exercise } );
        return exercise;
      });

      console.log("Creating...");
      ExerciseModel.create( exercises, function ( err, models ) {

        if ( err ) return console.error( err );

        console.log( "%s exercise models added!", models && models.length );

        if ( _.isFunction(callback) ) callback();
      });
    });
  }


  function handleContent ( rows ) {

    var fields;
    var fieldRowIndex;
    var data = false;
    var exerciseTypes = [];

    var exercises = _.compact(_.map( rows, function ( row, rowI ) {

      var exercise = {};

      if ( row.length === 1 && row[0] === "Exercise" ) {

        fieldRowIndex = rowI + 1;
        fields = _.map( rows[fieldRowIndex], function ( field ) {
          if ( field === "Set" ) return "setNumber";
          return field.toLowerCase();
        });
        return null;
      }

      if ( rowI > fieldRowIndex ) data = true;
      if ( !data ) return null;

      _.each( fields, function ( field, fieldI ) {

        var value = row[fieldI];
        if ( !value ) return;

        if ( field === "weight" ) {
          value = value.substr( 0, value.length - 2 );
        }

        if ( field === "exercise" ) {
          exerciseTypes.push( value );
        }

        exercise[field] = value;
      });

      return exercise;
    }));


    addToDatabase( exerciseTypes, exercises );
  }

})();
