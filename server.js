
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");



// Require Mongoose Models
var db = require("./models");
var routes = require("./routes");

var PORT = process.env.PORT || 3000;


var app = express();

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));



app.use(bodyParser.json());


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

console.log(routes);
 app.use(routes.Api);
 app.use(routes.Route);
// routes.initialize(app);

// Sets connection info for local or deployed connection
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);



app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });