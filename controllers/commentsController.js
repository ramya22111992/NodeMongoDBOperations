const cors=require('../routes/cors');

exports.getAllCommentsForPost=(req,res,next)=>{

    res.setHeader('Content-Type','application/json');
    res.setHeader('Timing-Allow-Origin',cors.whiteListedOrigins);
  
    res.status(200).json({
      "postId": 1,
      "id": 1,
      "name": "id labore ex et quam laborum",
      "email": "Eliseo@gardner.biz",
      "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
    })

}