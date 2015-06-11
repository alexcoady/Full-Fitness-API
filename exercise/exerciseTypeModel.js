var mongoose = require("mongoose");

var ExerciseTypeSchema = new mongoose.Schema({
  name: String,
  slug: String
});

var ExerciseTypeModel= mongoose.model("ExerciseType", ExerciseTypeSchema);

module.exports = {
  Model: ExerciseTypeModel,
  Schema: ExerciseTypeSchema
};
