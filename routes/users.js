const express = require("express");
const router = express.Router();
const userController = require("../controllers/users_controller");

router.get("/profile", userController.profile);
router.get("/signin",userController.signIn);
router.get("/signup",userController.signUp);

router.post("/create",userController.create);
router.post("/create-session",userController.createSession);
router.post("/signout",userController.signout);

module.exports = router;
