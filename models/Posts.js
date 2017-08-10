/**
 * Created by nandakumar on 7/18/17.
 */
var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title : String,
    upvotes : { type : Number, default :0},
    downvote : { type : Number, default :0},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]

});

PostSchema.methods.upVote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

PostSchema.methods.downVote = function(cb) {
    this.downvote -= 1;
    this.save(cb);
};
mongoose.model('Post',PostSchema);