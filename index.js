//import express 
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// import router 
const authRouter = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");

// response body dalam bentuk json
app.use(bodyParser.json())

// case CORS
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Header", "Content-Type, Authorization")
    next();
}) 

//menambhakan error default
app.use((error,req,res,next)=>{   
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({message:message, data:data})
})

// use artinya menerima semua method, ex: put, post, get
app.use('/v1/auth', authRouter)
app.use('/v1/blog', blogRoutes)

//koneksi database
mongoose.connect('mongodb+srv://afsori:3r15pAClFCVe4aUy@cluster0.ssjrk.mongodb.net/<dbname>?retryWrites=true&w=majority')
    .then(()=>{
        // implement di port 4000
        app.listen(4000,()=>{console.log('connection success')})
    })
    .catch((err)=>{
        console.log(err)
    })
