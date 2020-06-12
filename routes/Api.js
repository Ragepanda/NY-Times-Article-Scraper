var express = require("express");
var Api = express.Router();
var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");
var request = require("request");




Api.get("/api/fetch", function (req, res) {
    request({ url: "https://www.nytimes.com/", gzip: true }, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var results = [];

            //console.log($("article"));
            $("article").each(function (index, element) {
                console.log($(element).find("h2").text());
                console.log("nytimes.com"+$(element).find("a").attr("href"));
                console.log($(element).find("p").text());

                var result = {};
                result.title = $(element).find("h2").text();
                result.link = "nytimes.com"+$(element).find("a").attr("href");
                result.summary = $(element).find("p").text();
                console.log(result);
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
                        .catch(function (err) {
                            throw err;
                        })
                }
            })
            res.json(results);
        }
        else
        console.log(error);
    })
});


Api.put("/api/save/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id },
        { $set: { saved: true } },
        { upsert: true },
        function (err, dbArticle) {
            res.json(dbArticle);
        }).
        catch(function (error) {
            throw error;
        })

    db.Article.findByIdAndUpdate(req.params.id)
});

Api.get("/api/headlines", function (req, res) {
    db.Article.find({ saved: false })
        .then(function (data) {
            res.json(data);
        }).catch(function (err) {
            throw err;
        })
});

Api.delete("/api/clear", function (req, res) {
    db.Article.deleteMany({ saved: false }).then(function (result) {
        res.json(result);
    }).catch(function (error) {
        throw error;
    })
});

Api.delete("/api/note/:id", function (req, res) {
    db.Article.findOneAndUpdate({ note: req.params.id },
        { $pull: { note: req.params.id } })
        .then(function (result) {
            db.Note.deleteOne({ _id: req.params.id })
                .then(function (result) {
                    console.log(result);
                    res.json({ hello: "world" });
                })

        })
});

Api.put("/api/note/:id", function (req, res) {

    db.Note.create(req.body).then(function (newNote) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: newNote._id } }, { new: true })
            .then(function (dbEntry) {
                res.json(dbEntry);
            })
            .catch(function (error) {
                throw error;
            });
    });
});

module.exports = Api;