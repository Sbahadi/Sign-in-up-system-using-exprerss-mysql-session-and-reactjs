import axios from "axios";
import "./pagesCss/homePage/home.css";
const Home = () => {
  const signOut = () => {
    axios.get("http://localhost:8080/api/v1/users/signOut").then((res) => {
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
        <button className="subBtn" onClick={signOut}>
          Sign out
        </button>
      </div>
    </div>
  );
};
export default Home;
