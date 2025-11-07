const express = require("express");
const Post_router = express.Router();
const {createPost,get_post,getpost_byid,update_post,delete_postbyid,search_post,get_receiver,add_like,like_count,check_like}=require("../controllers/PostController")
const {authenticateToken}=require("../middlewares/Authtoken")
const {uploadMiddleware}=require("../middlewares/Uploadmiddleware")


Post_router.put("/update_post/:id",authenticateToken, uploadMiddleware.single("image"),update_post)
Post_router.post("/createpost",authenticateToken, uploadMiddleware.single("image"),createPost);
Post_router.get("/getpost",get_post)
Post_router.get("/getpostbyid/:id",authenticateToken,getpost_byid)

Post_router.get("/search_post",search_post)
Post_router.delete("/delete_post/:id",authenticateToken,delete_postbyid)
Post_router.get("/getreceiver/:id",get_receiver)
Post_router.post("/addlike",add_like)
Post_router.get("/like_count/:id",like_count)
Post_router.post("/checklike",check_like)
module.exports=Post_router