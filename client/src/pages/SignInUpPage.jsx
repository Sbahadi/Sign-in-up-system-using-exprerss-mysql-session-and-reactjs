import axios from "axios";
import { useReducer, useRef } from "react";
import "./pagesCss/signInUp/signInUp.css";
import "./pagesCss/signInUp/signInUpMc.css";

const showPassword = (input, icon) => {
  // toogle between visibility and invisibility of the password input
  if (input.getAttribute("type") === "password") {
    input.setAttribute("type", "text");
    icon.className = "fas fa-eye";
  } else {
    input.setAttribute("type", "password");
    icon.className = "fas fa-eye-slash";
  }
};
const checkEmail = (email) => {
  // checking if the given email is a valid email
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
// signIn reducer and state
const signInReducer = (state, action) => {
  if (action.type === "waitingForRes") {
    return { ...state, waitingForRes: true };
  }
  if (action.type === "resArrived") {
    return {
      ...state,
      waitingForRes: false,
      signedSuccessfully: action.success,
      isThereIsASignInErr: action.failed,
    };
  }
};
const signInDefaultState = {
  waitingForRes: false,
  signedSuccessfully: false,
  isThereIsASignInErr: false,
};
//signUp reducer and state
const signUpReducer = (state, action) => {
  if (action.type === "waitingForRes") {
    return { ...state, waitingForRes: true };
  }
  if (action.type === "resArrived") {
    return {
      ...state,
      waitingForRes: false,
      signedUpSuccessfully: action.success,
      isThereIsASignUpErr: action.failed,
    };
  }
};
const signUpDefaultState = {
  waitingForRes: false,
  signedUpSuccessfully: false,
  isThereIsASignUpErr: false,
};
const SignIn = ({ showSignUp }) => {
  const passwordInput = useRef(null);
  const emailInput = useRef(null);
  const showPasswordBtn = useRef(null);
  const errTxt = useRef([]);
  const [signInState, signInDispatch] = useReducer(
    signInReducer,
    signInDefaultState
  );
  const reqSignIn = () => {
    if (!checkEmail(emailInput.current.value)) {
      errTxt.current[0].style.display = "block";
    } else {
      errTxt.current[0].style.display = "none";
    }
    if (passwordInput.current.value === "") {
      errTxt.current[1].style.display = "block";
    } else {
      errTxt.current[1].style.display = "none";
    }
    if (
      !checkEmail(emailInput.current.value) ||
      passwordInput.current.value === ""
    ) {
      return;
    }
    signInDispatch({ type: "waitingForRes" });
    axios
      .post("http://localhost:8080/api/v1/users/signIn", {
        userEmail: emailInput.current.value.trim(),
        userPassword: passwordInput.current.value,
      })
      .then((res) => {
        console.log(res);
        signInDispatch({
          type: "resArrived",
          success: res.data.isAuth,
          failed: res.data.isAuth === true ? false : true,
        });
        if (res.data.isAuth === true) {
          setTimeout(() => {
            window.location.href = "/";
          }, 300);
        }
      });
  };

  return (
    // <div id="signInCon">
    <div id="signInHolder">
      <div className="signTitleCon">
        <p>Sign In</p>
        {signInState.isThereIsASignInErr && (
          <p className="signErr">Email or password is incorrect</p>
        )}
        {signInState.signedSuccessfully && (
          <p className="signSuccess">You signed in successfully</p>
        )}
      </div>
      <div id="signInInputsCon">
        {!signInState.waitingForRes ? (
          <>
            <div className="inputAndLabelCon">
              <div className="labelCon">
                <label htmlFor="signInEmailInput">Email :</label>
                <span ref={(e) => (errTxt.current[0] = e)}>Necessary</span>
              </div>
              <div className="inputCon">
                <input
                  ref={emailInput}
                  id="signInEmailInput"
                  type="text"
                  placeholder="Email"
                />
                <i className="fas fa-at"></i>
              </div>
            </div>
            <div className="inputAndLabelCon">
              <div className="labelCon">
                <label htmlFor="signInPasswordInput">Password :</label>
                <span ref={(e) => (errTxt.current[1] = e)}>Necessary</span>
              </div>
              <div className="inputCon">
                <input
                  id="signInPasswordInput"
                  ref={passwordInput}
                  type="password"
                  placeholder="Password"
                />
                <i
                  ref={showPasswordBtn}
                  className="fas fa-eye-slash"
                  onClick={() => {
                    showPassword(
                      passwordInput.current,
                      showPasswordBtn.current
                    );
                  }}
                ></i>
              </div>
            </div>
          </>
        ) : (
          <div className="normalLoadingCircle"></div>
        )}
      </div>
      <div className="signBtnSubCon">
        <button className="subBtn" onClick={reqSignIn}>
          Sign in
        </button>
        <span onClick={() => showSignUp()}>Create an account</span>
      </div>
    </div>
    // </div>
  );
};
const SignUp = ({ showSignIn }) => {
  const userNameInput = useRef(null);
  const userEmailInput = useRef(null);
  const errTxt = useRef([]);
  const passwordInput = useRef(null);
  const showPasswordBtn = useRef(null);
  const [signUpState, signUpDispatch] = useReducer(
    signUpReducer,
    signUpDefaultState
  );
  const reqSignUp = () => {
    if (userNameInput.current.value.trim() === "") {
      errTxt.current[0].style.display = "block";
    } else {
      errTxt.current[0].style.display = "none";
    }
    if (
      userEmailInput.current.value.trim() === "" ||
      !checkEmail(userEmailInput.current.value.trim())
    ) {
      errTxt.current[1].style.display = "block";
    } else {
      errTxt.current[1].style.display = "none";
    }
    if (passwordInput.current.value.trim() === "") {
      errTxt.current[2].style.display = "block";
    } else {
      errTxt.current[2].style.display = "none";
    }
    if (
      userNameInput.current.value.trim() === "" ||
      userEmailInput.current.value.trim() === "" ||
      !checkEmail(userEmailInput.current.value.trim()) ||
      passwordInput.current.value.trim() === ""
    ) {
      return;
    }
    signUpDispatch({ type: "waitingForRes" });
    axios
      .post("http://localhost:8080/api/v1/users/signUp", {
        userName: userNameInput.current.value.trim(),
        userEmail: userEmailInput.current.value.trim(),
        userPasswod: passwordInput.current.value,
      })
      .then((res) => {
        console.log(res);
        signUpDispatch({
          type: "resArrived",
          success: res.data.signedUp,
          failed: res.data.signedUp === true ? false : true,
        });
        if (res.data.signedUp === true) {
          setTimeout(() => {
            window.location.href = "/";
          }, 300);
        }
      });
  };
  return (
    <div id="signUpCon">
      <div className="signTitleCon">
        <p className="signTitle">Sign Up</p>
        {signUpState.isThereIsASignUpErr && (
          <p className="signErr" style={{ top: "90%" }}>
            This email is already taken
          </p>
        )}
        {signUpState.signedUpSuccessfully && (
          <p className="signSuccess" style={{ top: "90%" }}>
            Your account created successfully
          </p>
        )}
      </div>
      <div id="signUpInputsCon">
        {!signUpState.waitingForRes ? (
          <>
            <div className="inputAndLabelCon">
              <div className="labelCon">
                <label htmlFor="signUpUserNameInput">User name :</label>
                <span ref={(e) => (errTxt.current[0] = e)}>Necessary</span>
              </div>
              <div className="inputCon">
                <input
                  ref={userNameInput}
                  id="signUpUserNameInput"
                  type="text"
                  placeholder="User name"
                />
                <i className="fas fa-user"></i>
              </div>
            </div>
            <div className="inputAndLabelCon">
              <div className="labelCon">
                <label htmlFor="signUpEmailInput">Email :</label>
                <span ref={(e) => (errTxt.current[1] = e)}>Necessary</span>
              </div>
              <div className="inputCon">
                <input
                  ref={userEmailInput}
                  id="signUpEmailInput"
                  type="text"
                  placeholder="Email"
                />
                <i className="fas fa-at"></i>
              </div>
            </div>
            <div className="inputAndLabelCon">
              <div className="labelCon">
                <label htmlFor="signUpPassword">Password :</label>
                <span ref={(e) => (errTxt.current[2] = e)}>Necessary</span>
              </div>
              <div className="inputCon">
                <input
                  ref={passwordInput}
                  id="signUpPassword"
                  type="password"
                  placeholder="Password"
                />
                <i
                  ref={showPasswordBtn}
                  onClick={() => {
                    showPassword(
                      passwordInput.current,
                      showPasswordBtn.current
                    );
                  }}
                  className="fas fa-eye-slash"
                ></i>
              </div>
            </div>
          </>
        ) : (
          <div className="normalLoadingCircle"></div>
        )}
      </div>
      <div className="signBtnSubCon">
        <button className="subBtn" onClick={reqSignUp}>
          Sign in
        </button>
        <span onClick={showSignIn}>I already have an account</span>
      </div>
    </div>
  );
};
export { SignIn, SignUp };
