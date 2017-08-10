var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
//var postncommentcontroller = require('./controllers/postncomment.controllers')
/* GET home page. */


module.exports = router;
router.get('/', root);


router.get('/posts', showAll);
router.post('/posts', addNew);
router.param('post', forParamById);
router.put('/posts/:post/upvote', upvoteThis);
router.put('/posts/:post/downvote',downvoteThis);

router.get('/posts/:post', individualPost);
router.post('/posts/:post/comments',commentsForPost);


function root(req, res, next) {
    res.render('index', { title: 'News App' });
}

function individualPost(req, res) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
    });
}

function commentsForPost(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.save(function(err, comment){
        if(err){ return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if(err){ return next(err); }

            res.json(comment);
        });
    });
}




function showAll(req, res, next) {
    Post.find(function(err, posts){
        if(err){ return next(err); }

        res.json(posts);
    });
}


function addNew(req, res, next) {
    var post = new Post(req.body);

    post.save(function(err, post){
        if(err){ return next(err); }

        res.json(post);
    });
}

function forParamById(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post){
        if (err) { return next(err); }
        if (!post) { return next(new Error('can\'t find post')); }

        req.post = post;
        return next();
    });
}

function upvoteThis(req, res, next) {
    req.post.upVote(function(err, post){
        if (err) { return next(err); }

        res.json(post);
    });
}

function downvoteThis(req, res, next) {
    req.post.downVote(function(err, post){
        if (err) { return next(err); }

        res.json(post);
    });
}