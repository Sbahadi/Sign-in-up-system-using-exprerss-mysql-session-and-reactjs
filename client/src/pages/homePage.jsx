import axios from "axios";
import { useRef } from "react";
import "./pagesCss/homePage/home.css";
const Home = () => {
  const logOutBtn = useRef(null);
  const signOut = () => {
    logOutBtn.current.style.pointerEvents = "none";
    logOutBtn.current.style.backgroundColor = "#ddd";
    axios.get("http://localhost:8080/api/v1/users/signOut").then((res) => {
      console.log(res.data);
      if (res.data.signOut === true) {
        window.location.href = "/";
      }
    });
  };
  return (
    <div id="homePageCon">
      <h1 id="homePageTitle">Home page</h1>
      <div id="homePageBtnsCon">
        <button className="subBtn">
          {" "}
          <a href="/settings">Go to settings</a>{" "}
        </button>
        <button ref={logOutBtn} className="subBtn" onClick={signOut}>
          Sign out
        </button>
      </div>
    </div>
  );
};
export default Home;
