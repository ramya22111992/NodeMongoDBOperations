const cors=require('../routes/cors');

exports.getAllTodosOfUser=(req,res,next)=>{
    res.setHeader('Content-Type','application/json');
    res.setHeader('Timing-Allow-Origin',cors.whiteListedOrigins); // To get the restricted timing info on client
  
    res.status(200).json({
        "userId": 1,
        "id": 1,
        "title": "delectus aut autem",
        "completed": false
    })
}