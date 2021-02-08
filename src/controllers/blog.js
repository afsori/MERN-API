const { validationResult } = require("express-validator");
const BlogPost = require("../models/blog");
const pathFile = require("path");
const fs = require("fs");

exports.createBlogPost = (req, res, next) => {
    // const title = req.body;
    // const body = req.body;
    // console.log('req file ini',req.file)

    const errors = validationResult(req);
    // console.log('ini error ya',errors)
    if (errors.isEmpty() === false) {
        const err = new Error("invalid value tidak sesuai");
        err.status = 400;
        err.data = errors.array();
        throw err;
    }
    
    // cek file upload
    if(!req.file){
        const err = new Error("image harus di upload");
        err.status = 422;
        throw err;
    }

    const Posting = new BlogPost({
        title: req.body.title,
        image:req.file.path,
         // yg diterima url file nya saja
        body: req.body.body,
        author: {
            uid: 1,
            name: "afsori"
        }
    })
    // console.log('ini posting', Posting)

    Posting.save()
        .then(result => {
            // console.log('ini resyl',result)
            res.status(201).json({
                message: "success post data",
                data: result
            })
        })
        .catch(err => {
            console.log(err)
        });

    next();
}

exports.getAllBlogPost=(req,res,next)=>{
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalItems;

    // hitung jumlah data
    BlogPost.find()
    .countDocuments()
    .then(count =>{
        totalItems = count;
       return BlogPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then(result =>{
        res.status(200).json({
            message:"data blogpost berhasil dipanggil",
            data:result,
            total_data:totalItems,
            per_page:parseInt(perPage),
            current_page:parseInt(currentPage)
        })
    })
    .catch(err => {
        next(err)
    })
}

exports.getBlogPostById = (req,res,next)=>{
    const postId = req.params.postId;
    BlogPost.findById(postId)
    .then(result=>{
        if(!result){
            const err = new Error("data tidak ditemukan");
            error.status = 404;
            throw err;
        }

        res.status(200).json({
            message:"data berhasil dipanggil",
            data:result
        })
    })
    .catch(err =>{
        next(err)
    })
}

exports.updateBlogpost = (req,res,next)=>{
    const errors = validationResult(req);

    if (errors.isEmpty() === false) {
        const err = new Error("invalid value tidak sesuai");
        err.status = 400;
        err.data = errors.array();
        throw err;
    }
    
    // cek file upload
    if(!req.file){
        const err = new Error("image harus di upload");
        err.status = 422;
        throw err;
    }
    
    const postId = req.params.postId;
    BlogPost.findById(postId)
    .then(result=>{
        if(!result){
            const error = new Error("Blog Post tidak ditemukan");
            error.status = 404;
            throw error;
        }

        result.title = req.body.title;
        result.body = req.body.body;
        result.image = req.file.path;

        return result.save();
    })
    .then(result =>{
        res.status(200).json({
            message:"data berhasil di update",
            data:result
        })
    })
    .catch(err=>{
        next(err)
    })
 
}

exports.deleteBlogPost = (req,res,next)=>{
    const dataId = req.params.postId;
    BlogPost.findById(dataId)
    .then(result =>{
        if(!result){
            const err = new Error("data tidak ditemukan");
            err.status = 404;
            throw err;
        }

        deleteImage(result.image);
        return BlogPost.findByIdAndRemove(dataId)
     
    })
    .then(result =>{
        res.status(200).json({
            message:"delete berhasil",
            data:result
        })
    })
    .catch(err =>{
        next(err);
    })
}

// hapus image
const deleteImage = (filePath) =>{
    console.log('ini filepath', filePath);
    console.log('ini dirname',(__dirname));

    // C:\Users\afsori\Documents\Latihan\mern-api\images\1612696707933-test editor.PNG
    filePath = pathFile.join(__dirname,"../../",filePath);
    fs.unlink(filePath, err => console.log(err));
}