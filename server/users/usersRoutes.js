const express = require("express");
const { authCheck, signIn, signUp, signOut } = require("./usersControlers.js");

const usersRoute = express.Router();

const authCheckMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(200).send({ isAuth: false, desc: "not authenticated" });
  }
};

usersRoute.get("/checkAuth", authCheck);
usersRoute.post("/signIn", signIn);
usersRoute.post("/signUp", signUp);
usersRoute.get("/signOut", signOut);
module.exports = usersRoute;
