import "./App.css";
import "./icons/css/all.css";
import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/styles.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/homePage.jsx";
import Settings from "./pages/settings.jsx";
import { SignIn, SignUp } from "./pages/SignInUpPage.jsx";
function App() {
  axios.defaults.withCredentials = true;
  const [waitingForAuthCheck, setWaitingForAuthCheck] = useState(true);
  const [isUserAuth, setIsUserAuth] = useState(false);
  const [whatFormToShow, setWhatFormToShow] = useState("in");

  //checking if the user is already loged in each time the page get reloaded to specify what routes can the user access
  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/users/checkAuth").then((res) => {
      console.log(res);
      setWaitingForAuthCheck(false);
      setIsUserAuth(res.data.isAuth);
    });
  }, []);
  // displaying loading circle and waiting for the response
  if (!waitingForAuthCheck) {
    if (isUserAuth) {
      // if the user is authenticated we want him to be able to access the setting page but not be able to access to sign-in and sign-up page
      return (
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/settings" element={<Settings />}></Route>
          </Routes>
        </Router>
      );
    } else {
      // if the user are not authenticated we want him to access the sign-in and sign-up page only
      return whatFormToShow === "in" ? (
        <SignIn showSignUp={() => setWhatFormToShow("up")} />
      ) : (
        <SignUp showSignIn={() => setWhatFormToShow("in")} />
      );
    }
  } else {
    return (
      <div id="loadingCircleCon">
        <div className="normalLoadingCircle"></div>
      </div>
    );
  }
}

export default App;
