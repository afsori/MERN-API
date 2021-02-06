const {validationResult} = require("express-validator");

exports.createBlogPost=(req,res,next)=>{
    const {title,body} = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      const err = new Error("invalid value tidak sesuai");
      err.status = 400;
      err.data = errors.array();
      throw err;
    }

    const result = {
        message:"success post data",
        data:{
            post_id:1,
            title:title,
            image:"imageurl.jpg",
            body:body,
            created_at:"12/08/2021",
            author:{
                uid:1,
                name:"afsori"
            }

        }
    }
    res.status(201).json(result)
    next();
}