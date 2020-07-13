const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();  // initialize app
app.set('view engine', 'ejs');  // ejs files
app.use(bodyParser.urlencoded({extended:true}));    // get value of html element
app.use(express.static("public"));  // public for static files



mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Article", articleSchema);



/////////////////////////////////     Request targeting all articles    /////////////////////////////////

app.route("/articles")

 //GET
.get(function(req, res) {
    Article.find({}, function(err, foundArticle){   // READ
        if(err) {
            res.send(err);
        }
        else {
            res.send(foundArticle);
        }
    });
})

// POST
.post(function(req,res){
    const article = new Article({
        title : req.body.title,
        content: req.body.content
    });
    article.save(function(err){
        if(err) {
            res.send(err);
        }
        else {
            res.send("Successfully entered");
        }
    });
})

// DELETE
.delete(function(req, res){
    Article.deleteMany({}, function(err){
        if(err) {
            res.send(err);
        }
        else {
            res.send("Successfully deleted all articles")
        }
    });
});


/////////////////////////////////     Request targeting specific articles    /////////////////////////////////

app.route("/articles/:articleTitle")

// GET
.get(function(req, res){
    Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle) {
            res.send(foundArticle);
        }
        else {
            res.send("Article not found");
        }
    });
})


// PUT
.put(function(req, res){
    Article.update(
        {title:req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite:true},
        function(err) {
            if(!err) {
                res.send("Successfully put details.");
            }
            else {
                res.send(err);
            }
        }
    );
})

// PATCH
.patch(function(req, res){
    Article.update(
        {title:req.params.articleTitle},
        {$set : req.body},      // Update only formData
        function(err){
            if(!err) {
                res.send("Successfully updated article.");
            }
            else {
                res.send(err);
            }
        }
    );
})

// DELETE
.delete(function(req, res){
    Article.deleteOne({title:req.params.articleTitle}, function(err){
        if(err) {
            res.send(err);
        }
        else {
            res.send("Successfully deleted the corrseponding articles")
        }
    });
});

app.listen(3000, function(){
    console.log("Server started at port 3000");
});
