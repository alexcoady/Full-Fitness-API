var express = require("express");

var exerciseRouter = new express.Router();

exerciseRouter.get("", function ( req, res ) {
  return res.send("lol");
})

exerciseRouter.get("/:whatever", function ( req, res ) {
  return res.send(req.params.whatever + "!");
})

module.exports = exerciseRouter;
