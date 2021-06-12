const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users_controller");

router.get("/profile/:id",passport.checkAuthentication, userController.profile);
router.get("/signin",passport.notAuthenticated,userController.signIn);
router.get("/signup",passport.notAuthenticated, userController.signUp);
router.get("/confirmation/:email/:token",userController.verifyAccountLink);

router.post("/create", userController.create);
router.post("/update/:id",passport.checkAuthentication,userController.updateProfile);
//use passport as a middleware to authenticate
router.post(
	"/create-session",
	passport.authenticate("local", { failureRedirect: "/users/signin" }),
	userController.createSession
);

router.get("/signout",userController.signout);

module.exports = router;
