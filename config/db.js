const mongoose = require("mongoose");
const Redis = require("ioredis");

const connection = mongoose.connect("mongodb+srv://swapnil:swapnil@cluster0.tush2vw.mongodb.net/weather?retryWrites=true&w=majority")


const redis = new Redis({
    port:15627,
    host:"redis-15627.c81.us-east-1-2.ec2.cloud.redislabs.com",
    username:"default",
    password:"qsVY2ix8gpm2BLickqHoFSEfan29yCVP",
    db:0
})



module.exports = {connection,redis}
