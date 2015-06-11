var mongoose    = require("mongoose");

// Conect to database
mongoose.connect("mongodb://127.0.0.1/full-fitness-1-0-0");
mongoose.connection.once("open", function callback () {
  console.info("Database: Connected");
});
