exports.register = (req,res,next)=>{
    const {name,email,password} = req.body

    const result = {
        message:"register success",
        data:{
            uid:1,
            name:name,
            email:email,
            password:password
        }
    }
    res.status(201).json(result);
}