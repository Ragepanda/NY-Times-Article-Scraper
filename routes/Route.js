var express = require("express");
var Route = express.Router();
var db = require("../models");

Route.get("/", function (req, res) {
    db.Article.find({ saved: false })
    .populate("note")
    .exec(function (err,articles) {
        res.render("index", { article: articles });
    });
});

Route.get("/saved", function (req, res) {
    db.Article.find({ saved: true }).then(function (article) {
        res.render("savedArticles", { article: article });
    }).catch(function (error) {
        res.send(err);
    })
});

//console.log(object);



module.exports = Route;

