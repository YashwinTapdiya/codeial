const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersConrtoller = require("../controllers/users_controller");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  usersConrtoller.profile
);

router.post(
  "/update/:id",
  passport.checkAuthentication,
  usersConrtoller.update
);

router.get("/sign-up", usersConrtoller.signUp);

router.get("/sign-in", usersConrtoller.signIn);

router.post("/create", usersConrtoller.create);

//forget password
router.get('/forgot-password',usersConrtoller.forgotPassword);
router.get('/change-password/:id',usersConrtoller.changePassword)
router.post('/reset-password',usersConrtoller.resetPassword);
router.post('/updatePassword/:id',usersConrtoller.updatePassword);

//use passport as a middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersConrtoller.createSession
);

router.get("/sign-out", usersConrtoller.destorySession);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/users/sign-in",
  }),
  usersConrtoller.createSession
);

module.exports = router;
