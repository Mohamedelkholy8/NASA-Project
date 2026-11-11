import Header from "../ui/Header";
import SpaceBackground from "../features/space/SpaceBackground";
import Hero from "../features/hero/Hero";
import { useParallax } from "../hooks/useParallax";
import Slide from "../features/hero/Slide";

function HomePage() {
  useParallax();

  return (
    <main className="home-page">
      <section className="home-hero">
        <SpaceBackground />
        <Header />
        <Hero />
      </section>
      <Slide />
    </main>
  );
}

export default HomePage;
