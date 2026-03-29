import banner3 from "../assets/banner3.jpeg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `url(${banner3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-left">
        <div className="hero-box">
          <p className="p">Boost Your Brain!</p>
          <h1 className="h1">Dyslexia Game On!</h1>
          <p className="p">Explore Our New Quests Online!</p>

          <button onClick={() => navigate("/games")}>
            Explore
          </button>
        </div>
      </div>

    </div>
  );
};

export default Home;