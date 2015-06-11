var mongoose = require("mongoose");

var ExerciseSchema = new mongoose.Schema({
  date: Date,
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExerciseType"
  },
  setNumber: Number,
  reps: Number,
  weight: Number,
  notes: String
});

var ExerciseModel= mongoose.model("Exercise", ExerciseSchema);

module.exports = {
  Model: ExerciseModel,
  Schema: ExerciseSchema
};
