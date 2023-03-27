const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel, WeatherModel } = require("../model/userModel");
const userRoute = express();
const jwt = require("jsonwebtoken");
const { redis } = require("../config/db");
const { authenticate } = require("../middlewear/authenticate");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const winston = require("winston");
const expressWinston = require("express-winston")

const logger = winston.createLogger({
    level:'info',
    transports:[
        new winston.transports.File({
            filename:"info.log",
            level:"info"
        }),
        new winston.transports.File({
            filename:"error.log",
            level:"error"
        }),
        new winston.transports.File({
            filename:"warn.log",
            level:"warn"
        }),
    ]
})


userRoute.get("/register",async(req,res)=>{
    var {name,email,password} = req.body
    try {
        var data = await UserModel.insertMany({name,email,password})
        logger.log("info","user register")
        res.send(data)
    } catch (error) {
        console.log(error);
        res.send("register wrong");
    }
})

userRoute.get("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        logger.log("info","user login")
        var data = await UserModel.find({email})
        if(data.length!=0)
        {
            if(data[0].password==password)
            {
                var token = jwt.sign({email},"key");
                redis.set("etoken",token);
                redis.get("etoken",(err,result)=>{
                    if(err)
                    {
                        console.log(err);
                    }else{
                        console.log(result)
                    }
                })
                res.send(token)
            }else{
                res.send("wrong credentials");
            }
        }else{
            res.send("you have to register first");
        }
    } catch (error) {
        logger.log("error","register api error")
        console.log(error);
        res.send("something went wrong while login");
    }
})

userRoute.get("/logout",(req,res)=>{
    try {
        logger.log("info","user logout")
        redis.get("etoken",(err,result)=>{
            if(err)
            {
                console.log(err);
            }else{
                redis.set("ltoken",result);
            }
        })
        redis.get('ltoken',(err,r)=>{
            if(err)
            {
                console.log(err);
            }else{
                console.log(r)
            }
        })
        res.send("logout")
    } catch (error) {
        logger.log("error","logout api error")
        res.send("something went rong hile logout");
    }
})

userRoute.get('/weather',authenticate,async (req,res)=>{
    try{
    logger.log("info","weather api call")
    redis.get('etoken',(p,q)=>{
        if(p)
        {
            console.log(p);
        }else{
            jwt.verify(q,"key",(E,R)=>{
                if(E){
                    console.log(E);
                }else{
                    var s = R.email;
                }
            })
        }
    })

    var apikey = "edf4fd366498c4bb36e5acdda74e16ed"
    const {cityname,statecode,countrycode} = req.body;
    var long = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=${apikey}`
    
    const response = await fetch(long);
    const data = await response.json();
    
    console.log(data[0].lat,data[0].lon);
 
    
    
    var api = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lat}&appid=edf4fd366498c4bb36e5acdda74e16ed`
   
    const r = await fetch(api);
    const d = await r.json();
 


    redis.get('etoken',(err,result)=>{
        if(err)
        {
            console.log(err);
        }else{
            jwt.verify(result,"key",async(a,b)=>{
                if(a)
                {
                    console.log(a);
                }else{
                    console.log(b)
                    var obj = {email:b.email,'cityname':req.body.cityname,'weather':d.main}
                    console.log(obj)
                    var x = await WeatherModel.insertMany(obj)
                    
                    redis.get(b.email,(s,t)=>{
                        if(s){
                            console.log(s)
                        }
                        else{
                            if(t==null)
                            {
                                redis.set(b.email,JSON.stringify([obj]));
                            }else{
                                var k = JSON.parse(t);
                                k.push(obj);
                                redis.set(b.email,JSON.stringify(k))
                            }
                            console.log(t)
                        }
                    })
                    console.log(x)
                }
            })
        }
    })


    res.send(d.main)}
    catch{
        logger.log("error","weather api error")
        res.send("weather api error")
    }
    
})


module.exports = {userRoute}