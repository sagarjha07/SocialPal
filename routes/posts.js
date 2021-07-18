const express = require("express");
const router = express.Router();
const passport = require("passport");
const postController=require("../controllers/post_controllers");

router.post("/create",passport.checkAuthentication,postController.createPost);
router.get("/destroy/:id",passport.checkAuthentication,postController.destroy);

router.patch("/:id/like",passport.checkAuthentication,postController.createLike);

module.exports=router;
