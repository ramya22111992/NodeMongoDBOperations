const cors=require('../routes/cors');
const commentModel=require('../models/commentModel');

exports.createCommentForPost=(req,res,next)=>{
   const newComment=new commentModel(req.body)
   newComment.save((err,comment)=>{
    if(err){
      res.setHeader('Content-Type','application/json');
      res.status(500).json({err:err});
    }
    else{
      res.setHeader('Content-Type','application/json');
      res.status(200).json({message:'Comment created successfully!'});
    }
   })

   
}

exports.getAllCommentsForPost=(req,res,next)=>{
  commentModel.find({postId:req.body.postId}).then(comments=>{
    res.setHeader('Content-Type','application/json');
    res.status(200).json(comments)
  })
  .catch(err=>{
    res.setHeader('Content-Type','application/json');
    res.status(500).json({err:err});
  })
  
}