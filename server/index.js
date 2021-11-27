const express = require("express");
const app = express();
const sessions = require("express-session");
const cors = require("cors");
const db = require("./db.js");
const MySQLStore = require("express-mysql-session")(sessions);
const usersRoutes = require("./users/usersRoutes.js");

//seting up middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
const sessionStore = new MySQLStore({}, db);
app.use(
  sessions({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use("/api/v1/users", usersRoutes);
app.listen(8080, () => {
  console.log("listening to the port 8080");
});
