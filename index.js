import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app=express();
const port=3000;

const API_URL="https://api.openweathermap.org/data/2.5/forecast";
const API_KEY="6547c3508cfd7465db0947f0ddab416d";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res)=>{
    res.render("index.ejs",{weatherData:null});
})

app.post("/send",async(req,res)=>{
    const city=req.body.location;
    try {
        const response = await axios.get(API_URL+`?q=${city}&appid=${API_KEY}`);
        const result=response.data;
        const time = result.list[0].dt_txt.split(' ')[1];
        const weatherData={
            Date:result.list[0].dt_txt.split(' ')[0],
            Temperature:Math.floor(result.list[0].main.temp-273.15),
            Humidity:result.list[0].main.humidity,
            Description:result.list[0].weather[0].description,
            location:result.city.name,
            forecast:[],
        }
        for(let i=1;i<result.list.length;i++){
            if(time===result.list[i].dt_txt.split(' ')[1]){
                weatherData.forecast.push({
                                         date:result.list[i].dt_txt.split(' ')[0],
                                         temperature:Math.floor(result.list[i].main.temp-273.15),
                                         humidity:result.list[i].main.humidity,
                                         weatherDescription:result.list[i].weather[0].description,
                                        });
            }
        }
        console.log(weatherData);
        res.render("index.ejs",{weatherData});
      } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs",{weatherData:null});
      }
})

app.listen(port,()=>{
    console.log(`Server is running on Port ${port}`);
});
