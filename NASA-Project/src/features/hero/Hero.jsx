import earthImg from "../../../assets/img/earth.png";
import globeImg from "../../../assets/img/globe.png";

function Hero() {
  return (
    <div className="hero-section">
      <div className="content">
        <h1 className="normalTittle">
          Explore <br />
          <span>THe magical Space </span>
        </h1>
        <p className="normalText">
          Explore the secrets of space. Accioverse helps you to check <br />
          space galactics.
        </p>
        <div className="center-btn">
          <button className="btn normalText">
            <span> &gt; </span>Discover how it works
          </button>
        </div>
        <div className="earth-img">
          <img src={earthImg} alt="" />
          <div className="globe" aria-hidden="true">
            <img src={globeImg} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
