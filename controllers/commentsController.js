const Comment=require("../models/comment");
const Post=require("../models/post");

module.exports.create=async (req,res)=>{
    try{
        const post=await Post.findById(req.body.post);
        if(post){
            const comment=await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });
            post.comments.push(comment);
            post.save();
            res.redirect("/");
        }
    }catch(err){
            console.log("Error in adding comment",err);
            return res.redirect("back");
    }
}