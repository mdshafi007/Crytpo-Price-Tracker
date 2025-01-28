const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const axios=require("axios");

require("dotenv").config();

const app=express();
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb://localhost:27017/crypto-tracker", {useNewUrlParser: true, useUnifiedTopology: true} )
.then(()=>console.log("MongoDB connected"))
.catch((err)=> console.log("Error connecting to MongoDB"));

const userschema=new mongoose.Schema({
    email:String,
    password:String,
})

const User=mongoose.model("user", userschema);

app.post("/register", async (req,res)=>{
    const {email,password}=req.body;

    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }

   const user=new User({email,password});
   await user.save();
   res.status(201).json({message:"User registeed successfully"});

});

app.post("/login", async(req,res)=>{
    const {email,password}=req.body;
    const userl=await User.findOne({email,password});
    if(!userl){
        return res.status(401).json({message:"Invalid email or password"});
    }

    res.status(201).json({message:"User login successful"});
});



app.get("/", (req,res)=>res.send("Server is running"));

app.get("/coins", async(req,res)=>{
    try{
        const response=await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
            params:{
                vs_currency:"inr",
                order: "market_cap_desc",
                per_page:100,
                page:1,
                sparkline:false

            },

        });
        res.json(response.data);
    } catch(error){
        res.status(500).json(({error:"Faield to fetch data"}));

    }
});

const PORT=5000;

app.listen(PORT, ()=>console.log("Server running on PORT"));