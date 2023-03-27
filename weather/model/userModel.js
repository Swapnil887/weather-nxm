const mongoose = require("mongoose")

const UserModel = mongoose.model("user",{
    "name":String,
    "email":String,
    "password":String
});

const WeatherModel = mongoose.model("weather",{
    'email':String,
    'cityname':String,
    'weather':{
        "temp": Number,
        "feels_like": Number,
        "temp_min": Number,
        "temp_max": Number,
        "pressure": Number,
        "humidity": Number,
        "sea_level": Number,
        "grnd_level": Number
      }
})


module.exports = {UserModel,WeatherModel}
