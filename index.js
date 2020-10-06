/*
 * Primary file for the API
 */
// @TODO fix twilio API and add integrated MongoDB
//Dependencies
require("dotenv").config({ path: ".env" });
var server = require("./lib/server");
var workers = require("./lib/workers");
require("./db/mongoose");
//Declare the app
var app = {};

app.init = () => {
  //Start the server
  server.init();

  //Start the Workers
  workers.init();
};

app.init();

//Export the app
module.exports = app;
