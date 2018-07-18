var express = require("express");
var Route = express.Router();
var db = require("../models");

Route.get("/", function (req, res) {
    db.Article.find({ saved: false }).then(function (article) {
        console.log("Load in");
        
        var articleMap = article.map(function (singleArticle) {
            //console.log(singleArticle);
            if (singleArticle.note.length > 0) {
               var newNotes = singleArticle.note.map(function (noteId) {
                    db.Note.findOne({ _id: noteId }).then(function (dbNote) {
                        console.log(dbNote);
                        noteId = dbNote.body;
                    })
                })
                console.log(newNotes);
                //singleArticle.note = newNotes;
                console.log(singleArticle);
            }
            else{
                singleArticle = singleArticle;
            }

        });


      //  console.log(articleMap);
        res.render("index", { article: article });
    }).catch(function (error) {
        res.send(error);
    })
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

