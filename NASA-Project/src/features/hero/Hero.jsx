import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import earthImg from "../../../assets/img/earth.png";
import globeImg from "../../../assets/img/globe.png";

// Put your video inside the /public folder and write its path here
const VIDEO_SRC = "/space-video.mp4";

function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // While the popup is open: close on Escape + stop the page from scrolling
  useEffect(() => {
    if (!isVideoOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsVideoOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isVideoOpen]);

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
          <button className="btn normalText" onClick={() => setIsVideoOpen(true)}>
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

      {/* Rendered in document.body so it is always centered on the screen */}
      {isVideoOpen &&
        createPortal(
          <div
            className="video-overlay"
            onClick={() => setIsVideoOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="How it works video"
          >
            {/* stopPropagation: clicking the video itself must not close it */}
            <div className="video-modal" onClick={(e) => e.stopPropagation()}>
              <video src={VIDEO_SRC} controls autoPlay playsInline />
              <button
                className="video-close"
                onClick={() => setIsVideoOpen(false)}
                aria-label="Close video"
              >
                &times;
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default Hero;
