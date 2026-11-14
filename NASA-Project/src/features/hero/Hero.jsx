import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import earthImg from "../../../assets/img/earth.png";
import globeImg from "../../../assets/img/globe.png";

const YOUTUBE_ID = "cCHs3uhRMbY";
const VIDEO_URL = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`;

function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const closeVideoAndScroll = useCallback(() => {
    document.body.style.overflow = "";
    setIsVideoOpen(false);
    requestAnimationFrame(() => {
      document.getElementById("slider")?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  // While the popup is open: close on Escape + stop the page from scrolling
  useEffect(() => {
    if (!isVideoOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeVideoAndScroll();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeVideoAndScroll, isVideoOpen]);

  return (
    <div className="hero-section">
      <div className="content">
        <h1 className="normalTittle">
          Explore <br />
          <span>THe magical Space </span>
        </h1>
        <p className="bigText">where forgotten stories comeback to life</p>
        <div className="center-btn">
          <button
            className="btn normalText"
            onClick={() => setIsVideoOpen(true)}
          >
            <span> &gt; </span>Discover Forgotten Stories
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
            onClick={closeVideoAndScroll}
            role="dialog"
            aria-modal="true"
            aria-label="How it works video"
          >
            {/* stopPropagation: clicking the video itself must not close it */}
            <div
              className="video-modal"
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: "none" }}
            >
              <iframe
                src={VIDEO_URL}
                title="How it works"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
              <button
                className="video-close"
                onClick={closeVideoAndScroll}
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
