const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
});
const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////// Requests targeting all 'articles'
app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, articles) => {
            if(!err){
                res.send(articles);
            }else{
                res.send(err);
            }
        });
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        newArticle.save((err) => {
            if(!err){
                res.send("A new article was added successfully");
            } else{
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if(!err){
                res.send("Successfully deleted all articles");
            } else {
                res.send(err);
            }
        });
    });

/////////////////////////////////////// Requests targeting a specific article
app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title : req.params.articleTitle}, (err, article) => {
            if(!err){
                res.send(article);
            } else{
                res.send(err);
            }
        });
    })

    .put((req, res) => {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (err) => {
                if(!err){
                    res.send("Updated article successfully");
                }else{
                    res.send("error")
                }
            }
        )
    })

    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            //{$set: req.body} --> same changes
            {$set:{title: req.body.title, content: req.body.content}},
            (err) => {
                if(!err){
                    res.send("Updated article successfully");
                }else{
                    res.send("error")
                }
            }
        )
    })

    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle}, (err) => {
            if(!err){
                res.send("Deleted article successfully");
            } else {
                res.send(err);
            }
        });
    });

app.listen(process.env.PORT || 2222, () => {
    console.log("App started on port 2222");
});
