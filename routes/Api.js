var express = require("express");
var Api = express.Router();
var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");

Api.get("/api/fetch", function (req, res) {
    axios.get("https://www.nytimes.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        var results = [];


        $("article").each(function (index, element) {
            var result = {};
            result.title = $(element).children("h2").children("a").text();
            result.link = $(element).children("h2").children("a").attr("href");
            result.summary = $(element).children(".summary").text();

            // filters out any scraped articles lacking a title, link or summary
            if (!(result.title === "" || result.link === "" || result.summary === "")) {
               
               // Checks the DB for duplicate titles 
// ***** TODO: Add authentication for link/summary matching too
                db.Article.find({ title: result.title }).
                    then(function (response) {
                        // If the length of the response is 0, it means there's no duplicate
                        if (!response.length) {               
                            results.push(result);
                            db.Article.create(result).
                                then(function (dbArticle) {                      
                                })
                        }
                    })
                    .catch(function(err){
                        throw err;
                    })
            }
        })
        res.json(results);
    })
});


Api.put("/api/save/:id", function (req, res) {
    console.log("Route hit");
    db.Article.findOneAndUpdate({ _id: req.params.id },
        { $set: { saved: true } },
        { upsert: true },
        function (err, dbArticle) {
            console.log(dbArticle)
            res.json(dbArticle);
        }).
        catch(function (error) {
            console.log(error);
            throw error;
        })

    db.Article.findByIdAndUpdate(req.params.id)
});

Api.get("/api/headlines", function(req, res){
    db.Article.find({saved:false})
    .then(function(data){
        res.json(data);
    }).catch(function(err){
        throw err;
    })
});

Api.delete("/api/clear", function(req,res){
    db.Article.deleteMany({saved:false}).then(function(result){
        res.json(result);
    }).catch(function(error){
        throw error;
    })
});

Api.put("/api/note/:id", function(req, res){
   console.log(req.params.id);
   console.log(req.body);
   db.Note.create(req.body).then(function(newNote){
    db.Article.findOneAndUpdate({ _id: req.params.id }, { $push:{ note: newNote._id }}, { new: true })
    .then(function(dbEntry){
        console.log(dbEntry);
        res.json(dbEntry);
    })
    .catch(function(error){
        throw error;
    });
   });
});

module.exports = Api;