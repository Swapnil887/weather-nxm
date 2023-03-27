const express = require("express");
const mongoose = require("mongoose");
const { connection } = require("./config/db");
const { userRoute } = require("./routes/user");

const app = express()

app.use(express.json())

app.use("/user",userRoute)


app.listen(8080,async()=>{
    try {
        await connection
        console.log("server is running")
    } catch (error) {
        console.log("server wrong")
    }
})