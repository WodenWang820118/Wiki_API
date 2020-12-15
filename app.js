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

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("article", articleSchema);

app.get("/articles", function(req, res){
    Article.find({}, function(err, foundArticles){
        if (err){console.log(err);}
        else {
            res.send(foundArticles);
        }
    });
});