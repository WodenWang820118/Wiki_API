const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(PORT, function() {
    console.log("Server started on port: " + PORT);
  });

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true})

const articleSchema = ({
    title: String,
    content: String
});

const Article = mongoose.model("article", articleSchema);

app.route("/articles")
    .get(function(req, res){
        Article.find({}, function(err, foundArticles){
            if (err){console.log(err);}
            else {
                res.send(foundArticles);
            }
        });
    })
    .post(function(req, res){
        const title =  req.body.title;
        const content = req.body.content;
    
        const newArticle = new Article({
            title: title,
            content: content
        });
    
        newArticle.save(function(err){
            if (err) {console.log(err);}
            else {
                res.send("Successfully adding an article.");
            }
        });
    
        console.log(title);
        console.log(content);
    
    })
    .delete(function(req, res){
        Article.deleteMany({}, function(err){
            if (err) {console.log(err);}
            else {
                res.send("Successfully delete all the articles.");
            }
        });
    });

app.route("/articles/:articleId")
    .get(function(req, res){

        Article.findOne({title: req.params.articleId}, function(err, foundArticle){
            if (err) {
                console.log(err);
            }else if (!foundArticle){
                res.send("No article found");
            }else {
                res.send(foundArticle);
            }
        });
    })
    .put(function(req, res){

        Article.update(
            {title: req.params.articleId},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.send("Successfully update the entire article");
                }
            }
        )
    })
    .patch(function(req, res){
        
        Article.updateOne(
            {title: req.params.articleId},
            {$set: req.body},
            {overwrite: true},
            function(err){
                if (err){
                    console.log(err);
                    res.send(err);
                } else {
                    res.send("Successfully update the article");
                    // the body includes the field and the content
                    // such as {content: "The modified text here"}
                    console.log(req.body);
                }
            }
        )
    })
    .delete(function(req, res) {

        Article.deleteOne(
            {title: req.params.articleId},
            function(err){
                if (err){
                    console.log(err);
                    res.send(err);
                } else {
                    res.send("Successfully delete the article");
                }
            }
        );
    });