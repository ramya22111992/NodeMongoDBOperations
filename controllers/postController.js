const cors=require('../routes/cors');

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