import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resetQuizProgress } from "../utils/quizProgress";
import Header from "../ui/Header";
import SpaceBackground from "../features/space/SpaceBackground";
import Hero from "../features/hero/Hero";
import { useParallax } from "../hooks/useParallax";
import Slide from "../features/hero/Slide";

function HomePage() {
  useParallax();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Testing helper: open  /?reset  to clear all quiz progress
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("reset")) {
      resetQuizProgress();
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Coming back from a quiz: jump straight to the slider section
  useEffect(() => {
    if (state?.scrollTo !== "slider") return;
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      document.getElementById("slider")?.scrollIntoView({ behavior: "auto" });
      navigate(".", { replace: true, state: null }); // so a page refresh doesn't jump again
    }, 150);
    return () => clearTimeout(t);
  }, [state, navigate]);

  return (
    <main className="home-page">
      <section className="home-hero">
        <SpaceBackground />
        <Header />
        <Hero />
      </section>
      <section id="slider">
        <Slide />
      </section>
    </main>
  );
}

export default HomePage;
