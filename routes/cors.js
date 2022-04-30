const cors=require('cors');
const whiteListedOrigins=["http://localhost:4200"];
const options=function(req,callback){
let err=null;
let corsObject={};
//console.log(req.headers); //gives the list of req headers
//console.log(req.header('Origin')) //gives the value of req header with name Origin
if(!req || whiteListedOrigins.find(x=>x=== req.header('Origin'))){
    corsObject={origin:true};
}
else{
 corsObject={origin:false};
 let err=new Error(`Cross Origin resource sharing is not enabled for ${req.header('Origin')} `)
}
return callback(err,corsObject);
}

exports.corsWithoutOptions=cors();
exports.corsWithOptions=cors(options);

exports.whiteListedOrigins=whiteListedOrigins;