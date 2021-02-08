const express = require("express");
const {body} = require("express-validator");

const router = express.Router();

const blogController = require("../controllers/blog");

// /v1/blog/post
router.post("/post",[
    body("title").isLength({min:5}).withMessage("title min 5 character"), 
    body("body").isLength({min:5}).withMessage("title min 5 character")], 
    blogController.createBlogPost);

router.get("/posts", blogController.getAllBlogPost);

router.get("/post/:postId", blogController.getBlogPostById);

router.put("/post/:postId",[
    body("title").isLength({min:5}).withMessage("title min 5 character"), 
    body("body").isLength({min:5}).withMessage("title min 5 character")],
     blogController.updateBlogpost);

router.delete("/post/:postId", blogController.deleteBlogPost);

module.exports = router;