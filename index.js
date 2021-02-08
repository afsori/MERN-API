//import express 
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const app = express();

// import router 
const authRouter = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");

// upload file
const fileStorage = multer.diskStorage({
destination : (req,file,cb)=>{
    // folder images
    cb(null, "images");
},
filename : (req,file,cb)=>{
    cb(null,  new Date().getTime() + "-" + file.originalname)
}
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg"){
        cb(null, true);
    } else {
        cb(null,false);
    }
}

app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")))

// response body dalam bentuk json
app.use(bodyParser.json())

// case CORS
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Header", "Content-Type, Authorization,Accept,Content-Length,Connection,Accept-Encoding")
    next();
}) 


// use artinya menerima semua method, ex: put, post, get
app.use('/v1/auth', authRouter)
app.use('/v1/blog', blogRoutes)

//menambhakan error default
app.use((error,req,res,next)=>{   
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({message:message, data:data})
})

//koneksi database
mongoose.connect('mongodb+srv://afsori:3r15pAClFCVe4aUy@cluster0.ssjrk.mongodb.net/blog?retryWrites=true&w=majority')
    .then(()=>{
        // implement di port 4000
        app.listen(4000,()=>{console.log('connection success')})
    })
    .catch((err)=>{
        console.log(err)
    })
