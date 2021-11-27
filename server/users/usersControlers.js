const bcrypt = require("bcrypt");
const db = require("../db.js");

const authCheck = (req, res) => {
  if (req.session.user) {
    res.status(200).send({ isAuth: true, desc: "authenticated" });
  } else {
    res.status(200).send({ isAuth: false, desc: "not authenticated" });
  }
};
const signIn = (req, res) => {
  // we check if the user is already signed-in just in case he reached the sign-in form somehow
  //(in this case is impossible sens we using the router in the front-end but I just want to make sure)
  if (req.session.user) {
    return res
      .status(200)
      .send({ isAuth: true, desc: "already authenticated" });
  }
  // stating the sign-in process by selecting the user data using his email
  const { userEmail, userPassword } = req.body;
  db.query(
    "SELECT * FROM users WHERE userEmail = ?",
    [userEmail],
    async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ isAuth: false, desc: "db error" });
      }
      console.log(result.length);
      //in case no user found with the given email we want to return it
      if (result.length === 0) {
        return res
          .status(200)
          .send({ isAuth: false, desc: "authentication failed" });
      }
      //if we found a user with the given email we want to check if passwords matches using bcrypt, if they match we retrun true and we create the session, if not we just return false
      if (await bcrypt.compare(userPassword, result[0].userPassword)) {
        req.session.user = {
          userId: result[0].userId,
          userName: result[0].userName,
        };
        return res
          .status(200)
          .send({ isAuth: true, desc: "authenticated successfully" });
      } else {
        return res
          .status(200)
          .send({ isAuth: false, desc: "authentication failed" });
      }
    }
  );
};
const signUp = async (req, res) => {
  const { userName, userEmail, userPasswod } = req.body;
  //starting the signUp process by hashing the password using bcrypt
  console.log(userName, userEmail, userPasswod);

  const hashedPassword = await bcrypt.hash(userPasswod, await bcrypt.genSalt());
  //now we gonna create this user by calling a mysql procedure (to avoid unnecessary  requests to the database) that check if the user exists by the given email
  //if he exists on the table it returns it , if he's not it's gonna insert the data (create the user) and return the inserted id to use it for the session
  db.query(
    "CALL signUp(? , ? , ?)",
    [userName, userEmail, hashedPassword],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("db err");
      }
      console.log(result[0][0]);
      if (result[0][0].response === "email taken") {
        return res.status(200).send({ signedUp: false, desc: "email taken" });
      }
      if (result[0][0].response === "account created") {
        req.session.user = { userId: result[0][0].userId, userName: userName };
        return res
          .status(201)
          .send({ signedUp: true, desc: "signed up successfully" });
      }
    }
  );
};
const signOut = (req, res) => {
  if (req.session.user) {
    req.session.destroy();
    return res
      .status(200)
      .send({ signOut: true, desc: "signed out successfully" });
  } else {
    return res.status(200).send({ signOut: true, desc: "already loged out" });
  }
};

module.exports = { authCheck, signIn, signUp, signOut };
