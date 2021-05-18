const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users_controller");

router.get("/profile",passport.checkAuthentication, userController.profile);
router.get("/signin",passport.notAuthenticated,userController.signIn);
router.get("/signup",passport.notAuthenticated, userController.signUp);

router.post("/create", userController.create);
//use passport as a middleware to authenticate
router.post(
	"/create-session",
	passport.authenticate("local", { failureRedirect: "/users/signin" }),
	userController.createSession
);

module.exports = router;
