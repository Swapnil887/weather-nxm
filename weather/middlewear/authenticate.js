const { redis } = require("../config/db");



const authenticate =async (req,res,next)=>{
    try {
        redis.get("etoken",(err,result)=>{
            if(err)
            {
                console.log(err)
            }else{
                // console.log(result);
                redis.get('ltoken',(x,y)=>{
                    if(x)
                    {
                        console.log(x);
                    }else{
                        if(result==y){
                            res.send("you haver to login again");
                        }else{
                            next();
                        }
                        
                    }
                })
            }
        })   
    
    } catch (error) {
        res.send("something went wrong in middleweare");
    }
}

module.exports = {authenticate}