const cors=require('../routes/cors');
const postModel=require('../models/postModel');

exports.createPostForUser=(req,res,next)=>{
    const newPost=new postModel(req.body);

    newPost.save((err,post)=>{
      if(err){
        res.setHeader('Content-Type','application/json');
        res.status(500).json({err:err});
      }
      else{
        res.setHeader('Content-Type','application/json');
        res.status(200).json({message:"Post created successfully"});
      }
    })
}

exports.getAllPostsForUser=(req,res,next)=>{
    res.setHeader('Content-Type','application/json');
    res.setHeader('Timing-Allow-Origin',cors.whiteListedOrigins)

    res.status(200).json({
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      })
}