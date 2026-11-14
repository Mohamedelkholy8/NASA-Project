import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
// Replace these with your four Kepler images (same folder, same format as the others).
import img1 from "../../assets/img/kepler1.jpg";
import img2 from "../../assets/img/kepler2.png";
import img3 from "../../assets/img/kepler3.jpg";
import img4 from "../../assets/img/kepler4.jpg";
import { Navigate } from "react-router-dom";
import Quiz from "../features/quiz/Quiz";
import { isQuizDone } from "../utils/quizProgress";

/* Edit the alt text / captions here to describe each photo. */
const photos = {
  hero: { src: img1, alt: "The Kepler space telescope in space" },
  plan: { src: img2, alt: "Kepler launching from Earth" },
  craft: { src: img3, alt: "The Kepler space telescope and its camera" },
  surface: {
    src: img4,
    alt: "An artist's view of a planet passing in front of its star",
    caption: "A planet crossing its star makes the star's light dip slightly.",
  },
  // only 4 images exist, so the banner reuses the hero photo
  banner: {
    src: img1,
    alt: "Kepler searching for planets beyond our solar system",
    caption: "More than 2,600 planets found outside our solar system.",
  },
};

const milestones = [
  {
    date: "6 Mar 2009",
    title: "Kepler launches",
    text: "A rocket carries the Kepler space telescope into space. It enters an orbit around the Sun, following Earth, and focuses on a region of sky near the constellation Cygnus.",
  },
  {
    date: "Jan 2010",
    title: "The first five planets",
    text: "NASA announces Kepler's first five discovered exoplanets.",
  },
  {
    date: "Feb 2011",
    title: "The Kepler-11 system",
    text: "Scientists announce the discovery of the Kepler-11 system, a star with six planets.",
  },
  {
    date: "May 2013",
    title: "A second wheel fails",
    text: "Kepler loses its second reaction wheel, which affects its ability to point accurately at its targets.",
  },
  {
    date: "2014",
    title: "The K2 mission begins",
    text: "The extended K2 mission begins its scientific observations, giving Kepler a second chance.",
  },
  {
    date: "18 Apr 2018",
    title: "TESS launches",
    text: "TESS lifts off to continue the search for exoplanets, before Kepler has officially retired.",
  },
  {
    date: "30 Oct 2018",
    title: "Kepler retires",
    text: "After more than nine years in space, Kepler runs out of fuel and NASA officially retires the spacecraft.",
  },
];

const hotspots = [
  {
    x: "42%",
    y: "20%",
    tag: "The star",
    title: "A tiny point of light",
    text: "Kepler continuously watched thousands of stars, looking for changes in their brightness. These changes can be incredibly small, which is why it needed such a powerful camera.",
    metric: "500,000+",
    label: "Stars observed during the mission",
  },
  {
    x: "27%",
    y: "40%",
    tag: "The planet",
    title: "A shadow on the star",
    text: "When a planet passes in front of its star, it blocks a small part of the light. By measuring how much the light decreases, scientists can estimate the planet's size.",
    metric: "2,600+",
    label: "Planets discovered outside our solar system",
  },
  {
    x: "67%",
    y: "80%",
    tag: "The repeating dip",
    title: "The same dip, again and again",
    text: "When the same decrease happens regularly, it is evidence of a planet. The time between repeated transits tells scientists how long the planet takes to complete one orbit.",
    metric: "1 orbit",
    label: "The time between two repeated transits",
  },
];

const glossary = [
  {
    term: "Exoplanet",
    full: "",
    text: "A planet that orbits a star outside our solar system.",
  },
  {
    term: "Transit Method",
    full: "",
    text: "A technique used to discover planets by measuring the small decrease in a star's brightness when a planet passes in front of it.",
  },
  {
    term: "Reaction Wheels",
    full: "",
    text: "Devices that help a spacecraft control its direction without using rocket engines.",
  },
  {
    term: "K2 Mission",
    full: "",
    text: "Kepler's extended mission, which continued scientific observations after the spacecraft experienced technical problems.",
  },
  {
    term: "Habitable Zone",
    full: "",
    text: "The region around a star where conditions may allow liquid water to exist on a planet's surface.",
  },
  {
    term: "TESS",
    full: "Transiting Exoplanet Survey Satellite",
    text: "A NASA space telescope designed to search for exoplanets around bright, nearby stars.",
  },
];

const quiz = [
  {
    q: "What was the main purpose of NASA's Kepler mission?",
    options: [
      "To explore the surface of Mars",
      "To search for planets outside our solar system",
      "To study the Earth's atmosphere",
      "To send astronauts to distant stars",
    ],
    answer: 1,
  },
  {
    q: "How did Kepler discover planets around distant stars?",
    options: [
      "By taking pictures of planets on their surfaces",
      "By listening for signals from planets",
      "By measuring tiny decreases in the brightness of stars",
      "By sending spacecraft to visit other solar systems",
    ],
    answer: 2,
  },
  {
    q: "What happened to Kepler in May 2013?",
    options: [
      "It landed on another planet",
      "It lost its second reaction wheel",
      "It ran out of fuel",
      "It discovered its first star",
    ],
    answer: 1,
  },
  {
    q: "What was the K2 mission?",
    options: [
      "A new spacecraft that replaced Kepler",
      "A mission to explore Jupiter",
      "An extended mission that allowed Kepler to continue working",
      "A mission to send astronauts into space",
    ],
    answer: 2,
  },
  {
    q: "What was TESS designed to do after Kepler?",
    options: [
      "Continue searching for exoplanets around bright, nearby stars",
      "Explore the Moon's surface",
      "Study only the planets in our solar system",
      "Repair the Kepler spacecraft",
    ],
    answer: 0,
  },
];

// TODO: replace with the Kepler video's YouTube ID
const YOUTUBE_ID = "YOUR_YOUTUBE_ID";
const VIDEO_URL = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=IBM+Plex+Sans:wght@400;500&display=swap');
html{scroll-behavior:smooth}
.vk{--bg:#EFE8E4;--surface:#FFFFFF;--text:#2A201C;--muted:#6E5F58;--line:#D9CCC4;--accent:#A8432A;--band:#2A201C;--band-text:#F3E6DC;
  --display:"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif;--body:"IBM Plex Sans","Helvetica Neue",Arial,sans-serif;
  background:var(--bg);color:var(--text);font:400 17px/1.65 var(--body);-webkit-font-smoothing:antialiased;min-height:100vh}
@media (prefers-color-scheme:dark){.vk{--bg:#1B1514;--surface:#271F1D;--text:#F0E5DD;--muted:#B3A199;--line:#41352F;--accent:#E8A66A;--band:#120D0C;--band-text:#F3E6DC}}
.vk,.vk *{box-sizing:border-box}
.vk a{color:inherit}
.vk :focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.vk p{margin:0}
.vk h1,.vk h2,.vk h3{font-family:var(--display);line-height:1.05;margin:0;letter-spacing:-.02em}
.vk h2{font-size:clamp(2rem,5vw,3.4rem);font-weight:800}
.vk h3{font-size:1.3rem;font-weight:800;letter-spacing:-.01em}
.vk .wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.vk .lede{color:var(--muted);max-width:56ch;margin-top:16px}
.vk section{padding:96px 0;scroll-margin-top:64px}
.vk header{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.vk nav{display:flex;align-items:center;justify-content:space-between;height:64px;gap:16px}
.vk .brand{font:800 1.1rem var(--display);text-decoration:none}
.vk nav ul{display:flex;gap:24px;list-style:none;margin:0;padding:0;font-size:.9rem}
.vk nav ul a{text-decoration:none;color:var(--muted)}
.vk nav ul a:hover{color:var(--text)}
@media(max-width:640px){.vk nav ul{gap:14px;font-size:.82rem}}

/* Photo hero */
.vk .hero{position:relative;min-height:92vh;display:flex;align-items:flex-end;overflow:hidden;background:#2A201C}
.vk .hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.vk .hero::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(26,14,8,.82) 0%,rgba(26,14,8,.45) 45%,rgba(26,14,8,.15) 100%)}
.vk .hero .wrap{position:relative;z-index:1;width:100%;color:#FBEFE2;padding-top:72px;padding-bottom:72px}
.vk .hero h1{font-size:clamp(3.2rem,11vw,8.5rem);font-weight:800;line-height:.92;letter-spacing:-.04em;max-width:9ch}
.vk .sub{margin-top:24px;font-size:1.25rem;max-width:34ch;font-weight:500}
.vk .btn{display:inline-block;margin-top:28px;background:#FBEFE2;color:#2B1810;text-decoration:none;font-weight:500;padding:14px 26px;border-radius:999px}
.vk .btn:hover{background:#fff}
.vk .btn .play{display:inline-grid;place-items:center;width:26px;height:26px;margin-right:10px;border-radius:50%;background:var(--accent);color:#fff;font-size:.65rem;padding-left:2px;vertical-align:middle}
.vk .watch-hint{margin-top:12px;font-size:.92rem;opacity:.85}
@media(prefers-reduced-motion:no-preference){.vk .btn .play{animation:vkpulse 2.4s infinite}}

.vk .facts{background:var(--band);color:var(--band-text)}
.vk .facts dl{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin:0;padding:28px 0}
.vk .facts dt{font-size:.8rem;opacity:.7}
.vk .facts dd{margin:4px 0 0;font:800 1.5rem var(--display)}
@media(max-width:700px){.vk .facts dl{grid-template-columns:1fr 1fr}}

/* Two-column cards (with or without photos) */
.vk .pair{display:grid;grid-template-columns:1fr 1fr;margin-top:48px;border:1px solid var(--line);border-radius:20px;overflow:hidden;background:var(--surface)}
.vk .pair>div{display:flex;flex-direction:column}
.vk .pair>div+div{border-left:1px solid var(--line)}
.vk .pair img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}
.vk .pair .txt{padding:36px}
.vk .role{color:var(--accent);font-weight:500;font-size:.9rem;margin-bottom:10px}
.vk .pair .txt p:not(.role){color:var(--muted);margin-top:12px}
.vk .tl-band .pair{background:var(--bg)}
.vk .verdict{margin-top:24px;padding:28px 36px;border-radius:20px;background:var(--band);color:var(--band-text)}
.vk .verdict p{max-width:70ch;margin-top:8px;opacity:.85}
@media(max-width:700px){.vk .pair{grid-template-columns:1fr}.vk .pair>div+div{border-left:0;border-top:1px solid var(--line)}}

.vk .tl-band{background:var(--surface);border-block:1px solid var(--line)}
.vk .tl{margin-top:48px}
.vk .tl-scroll{overflow-x:auto;padding-bottom:6px}
.vk .tl-track{display:grid;grid-template-columns:repeat(4,1fr);position:relative}
.vk .tl-track::before{content:"";position:absolute;left:0;right:0;top:11px;height:2px;background:var(--line)}
.vk .tl-fill{position:absolute;left:0;top:11px;height:2px;background:var(--accent);transition:width .35s}
.vk .tl-btn{all:unset;cursor:pointer;position:relative;padding-top:36px;font-size:.9rem;color:var(--muted)}
.vk .tl-btn::before{content:"";position:absolute;top:2px;left:0;width:20px;height:20px;border-radius:50%;background:var(--surface);border:2px solid var(--line);transition:.25s}
.vk .tl-btn[aria-selected="true"]{color:var(--text);font-weight:500}
.vk .tl-btn[aria-selected="true"]::before,.vk .tl-btn.done::before{background:var(--accent);border-color:var(--accent)}
.vk .tl-btn:focus-visible{outline:3px solid var(--accent);outline-offset:4px}
.vk .tl-detail{margin-top:36px;display:grid;grid-template-columns:1fr 1.4fr;gap:32px;align-items:start;padding:32px;border-radius:20px;background:var(--bg);border:1px solid var(--line)}
.vk .when{font:800 clamp(1.8rem,4vw,2.6rem) var(--display);color:var(--accent);line-height:1}
@media(max-width:700px){.vk .tl-detail{grid-template-columns:1fr;gap:12px}.vk .tl-btn{font-size:.75rem;padding-right:8px}.vk .tl-track{min-width:700px}}

.vk .lab{display:grid;grid-template-columns:1.5fr 1fr;gap:24px;margin-top:48px;align-items:stretch}
.vk .stage{position:relative;border-radius:20px;background:#2A201C;overflow:hidden;aspect-ratio:3/2}
.vk .stage svg{width:100%;height:100%;display:block}
.vk .hot{all:unset;cursor:pointer;position:absolute;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;background:#E8A66A;color:#2A1408;font:800 .95rem var(--display);display:grid;place-items:center}
.vk .hot[aria-pressed="true"]{background:#fff;box-shadow:0 0 0 8px rgba(255,255,255,.28)}
.vk .hot:focus-visible{outline:3px solid #fff;outline-offset:3px}
@media(prefers-reduced-motion:no-preference){.vk .hot:not([aria-pressed="true"]){animation:vkpulse 2.4s infinite}}
@keyframes vkpulse{0%{box-shadow:0 0 0 0 rgba(232,166,106,.6)}70%{box-shadow:0 0 0 12px rgba(232,166,106,0)}100%{box-shadow:0 0 0 0 rgba(232,166,106,0)}}
.vk .panel{padding:32px;border-radius:20px;background:var(--surface);border:1px solid var(--line);display:flex;flex-direction:column;justify-content:space-between;gap:24px}
.vk .part{color:var(--accent);font-size:.9rem;font-weight:500;margin-bottom:8px}
.vk .panel .d{color:var(--muted);margin-top:14px}
.vk .metric{border-top:1px solid var(--line);padding-top:20px}
.vk .metric b{display:block;font:800 2.6rem var(--display);color:var(--accent);line-height:1}
.vk .metric span{font-size:.85rem;color:var(--muted)}
@media(max-width:800px){.vk .lab{grid-template-columns:1fr}}

/* Shared photo figure */
.vk figure{margin:0}
.vk .shot{margin-top:48px;border-radius:20px;overflow:hidden;border:1px solid var(--line);background:var(--surface)}
.vk .shot img{width:100%;max-height:520px;aspect-ratio:21/9;object-fit:cover;display:block}
.vk .shot figcaption{padding:14px 20px;font-size:.88rem;color:var(--muted)}
@media(max-width:700px){.vk .shot img{aspect-ratio:4/3}}

.vk .planet{background:var(--band);color:var(--band-text)}
.vk .planet .lede{color:inherit;opacity:.75}
.vk .planet .shot{border-color:rgba(255,255,255,.18);background:transparent}
.vk .planet .shot figcaption{color:inherit;opacity:.72}
.vk .big{display:grid;grid-template-columns:auto 1fr;gap:48px;align-items:end;margin-top:48px}
.vk .big b{font:800 clamp(5rem,18vw,12rem) var(--display);line-height:.8;letter-spacing:-.05em;color:#E8A66A}
.vk .big p{max-width:34ch;opacity:.85}
.vk .notes{display:grid;grid-template-columns:repeat(3,1fr);margin-top:64px;border-top:1px solid rgba(255,255,255,.18)}
.vk .notes div{padding:28px 28px 0 0}
.vk .notes div+div{padding-left:28px;border-left:1px solid rgba(255,255,255,.18)}
.vk .notes h3{font-size:1.15rem}
.vk .notes p{opacity:.72;margin-top:8px;font-size:.95rem}
/* light-background variant of the big number + notes */
.vk .light .big b{color:var(--accent)}
.vk .light .big p{color:var(--muted);opacity:1}
.vk .light .notes{border-top-color:var(--line)}
.vk .light .notes div+div{border-left-color:var(--line)}
.vk .light .notes p{color:var(--muted);opacity:1}
@media(max-width:800px){.vk .big{grid-template-columns:1fr;gap:20px}.vk .notes{grid-template-columns:1fr}.vk .notes div,.vk .notes div+div{padding:24px 0 0;border-left:0}}

/* Glossary */
.vk .gloss{display:grid;grid-template-columns:1fr 1fr;margin:48px 0 0;border:1px solid var(--line);border-radius:20px;overflow:hidden;background:var(--surface)}
.vk .gloss div{padding:28px 32px;border-bottom:1px solid var(--line)}
.vk .gloss div:nth-child(odd){border-right:1px solid var(--line)}
.vk .gloss div:nth-last-child(-n+2){border-bottom:0}
.vk .gloss dt{font:800 1.3rem var(--display);letter-spacing:-.01em}
.vk .gloss .full{display:block;color:var(--accent);font-size:.9rem;font-weight:500;margin-top:2px}
.vk .gloss dd{margin:10px 0 0;color:var(--muted)}
@media(max-width:700px){.vk .gloss{grid-template-columns:1fr}.vk .gloss div,.vk .gloss div:nth-child(odd){border-right:0;border-bottom:1px solid var(--line)}.vk .gloss div:last-child{border-bottom:0}.vk .gloss div:nth-last-child(2){border-bottom:1px solid var(--line)}}

.vk footer{padding:32px 0;color:var(--muted);font-size:.85rem;border-top:1px solid var(--line)}
`;

export default function Kepler() {
  const [m, setM] = useState(0);
  const [h, setH] = useState(0);
  const hs = hotspots[h];
  const ms = milestones[m];

  const section = useRef(null);
  // checked once on page load (not live), so the quiz can still show its
  // success message before it sends the user back to the slider
  const [alreadyDone] = useState(() => isQuizDone("kepler"));
  // video popup (same behaviour as the Hero popup on the home page)
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  function openVideo(e) {
    e.preventDefault();
    setIsVideoOpen(true);
  }

  // closing the popup scrolls down to the story section
  const closeVideo = useCallback(() => {
    document.body.style.overflow = "";
    setIsVideoOpen(false);
    requestAnimationFrame(() => {
      section.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  // while the popup is open: close on Escape + stop the page from scrolling
  useEffect(() => {
    if (!isVideoOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeVideo();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [closeVideo, isVideoOpen]);

  // quiz already solved -> this page is closed, go back to the slider
  if (alreadyDone) {
    return <Navigate to="/" replace state={{ scrollTo: "slider" }} />;
  }

  return (
    <div className="vk" id="top">
      <style>{css}</style>

      <main>
        <div className="hero">
          <img
            className="hero-img"
            src={photos.hero.src}
            alt={photos.hero.alt}
          />
          <div className="wrap">
            <h1>Kepler</h1>
            <p className="sub">
              Our adventure in search of new worlds. Sometimes, all we need to
              do is watch a little light disappear.
            </p>
            <a className="btn scroll" href="#" onClick={openVideo}>
              <span className="play" aria-hidden="true">
                &#9654;
              </span>
              Explore the mission
            </a>
            <p className="watch-hint">Click here to watch the mission video</p>
          </div>
        </div>

        {/* Rendered in document.body so it is always centered on the screen */}
        {isVideoOpen &&
          createPortal(
            <div
              className="video-overlay"
              onClick={closeVideo}
              role="dialog"
              aria-modal="true"
              aria-label="Kepler mission video"
            >
              {/* stopPropagation: clicking the video itself must not close it */}
              <div className="video-modal" onClick={(e) => e.stopPropagation()}>
                <iframe
                  src={VIDEO_URL}
                  title="Kepler mission"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                />
                <button
                  className="video-close"
                  onClick={closeVideo}
                  aria-label="Close video"
                >
                  &times;
                </button>
              </div>
            </div>,
            document.body,
          )}

        <div className="facts">
          <div className="wrap">
            <dl>
              <div>
                <dt>Launched</dt>
                <dd>6 Mar 2009</dd>
              </div>
              <div>
                <dt>Stars observed</dt>
                <dd>500,000+</dd>
              </div>
              <div>
                <dt>Planets found</dt>
                <dd>2,600+</dd>
              </div>
              <div>
                <dt>Retired</dt>
                <dd>30 Oct 2018</dd>
              </div>
            </dl>
          </div>
        </div>

        <section id="story" ref={section}>
          <div className="wrap">
            <h2>A telescope that finds planets by watching light</h2>
            <p className="lede">
              Kepler never lands on another planet and never takes pictures of
              one. From an orbit around the Sun, following Earth, it watches
              thousands of stars near the constellation Cygnus and waits for
              their light to change.
            </p>
            <div className="pair">
              <div>
                <img
                  src={photos.plan.src}
                  alt={photos.plan.alt}
                  loading="lazy"
                />
                <div className="txt">
                  <p className="role">The goal</p>
                  <h3>Earth-sized planets</h3>
                  <p>
                    Discover Earth-sized planets orbiting distant stars, and
                    maybe help answer one of humanity's biggest questions: are
                    we alone in the universe?
                  </p>
                </div>
              </div>
              <div>
                <img
                  src={photos.craft.src}
                  alt={photos.craft.alt}
                  loading="lazy"
                />
                <div className="txt">
                  <p className="role">The telescope</p>
                  <h3>A camera for starlight</h3>
                  <p>
                    A powerful camera observes thousands of stars at the same
                    time. Changes in a star's brightness can be incredibly
                    small, so every tiny change could be an important clue.
                  </p>
                </div>
              </div>
            </div>
            <div className="verdict">
              <h3>The Transit Method</h3>
              <p>
                Pass a small ball in front of a lamp and the light dims for a
                moment. When a planet passes in front of its star, it blocks a
                little of the star's light in the same way. Kepler measures that
                tiny dip.
              </p>
            </div>
          </div>
        </section>

        <section id="journey" className="tl-band">
          <div className="wrap">
            <h2>From launch to retirement</h2>
            <p className="lede">
              Select a date to follow Kepler from its launch in 2009 to the end
              of its mission.
            </p>
            <div className="tl">
              <div className="tl-scroll">
                <div
                  className="tl-track"
                  style={{
                    gridTemplateColumns: `repeat(${milestones.length},1fr)`,
                  }}
                  role="tablist"
                  aria-label="Mission timeline"
                >
                  <div
                    className="tl-fill"
                    style={{ width: `${(m / (milestones.length - 1)) * 100}%` }}
                  />
                  {milestones.map((item, i) => (
                    <button
                      key={item.date}
                      role="tab"
                      aria-selected={i === m}
                      className={`tl-btn${i < m ? " done" : ""}`}
                      onClick={() => setM(i)}
                    >
                      {item.date}
                    </button>
                  ))}
                </div>
              </div>
              <div className="tl-detail" aria-live="polite">
                <div className="when">{ms.date}</div>
                <div>
                  <h3>{ms.title}</h3>
                  <p className="lede" style={{ marginTop: 10 }}>
                    {ms.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="lab">
          <div className="wrap">
            <h2>How a vanishing light reveals a planet</h2>
            <p className="lede">
              Tap a numbered point to see how a star, a planet and a tiny dip in
              brightness add up to a discovery.
            </p>
            <div className="lab">
              <div className="stage">
                <svg
                  viewBox="0 0 600 400"
                  role="img"
                  aria-label="Simplified drawing of a planet crossing in front of a star, with a graph below showing the star's brightness dipping twice"
                >
                  <defs>
                    <linearGradient id="kpg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#3B2A24" />
                      <stop offset="1" stopColor="#5A3326" />
                    </linearGradient>
                    <radialGradient id="kpstar" cx="50%" cy="50%" r="50%">
                      <stop offset="0" stopColor="#FFF1CC" />
                      <stop offset="1" stopColor="#E8C97A" />
                    </radialGradient>
                  </defs>
                  <rect width="600" height="400" fill="url(#kpg)" />

                  {/* star with glow */}
                  <circle cx="200" cy="125" r="104" fill="#E8C97A" opacity=".14" />
                  <circle cx="200" cy="125" r="80" fill="url(#kpstar)" />
                  {/* planet in front of the star */}
                  <circle cx="188" cy="138" r="20" fill="#2A201C" />
                  {/* planet's path */}
                  <path
                    d="M60 138 H150"
                    stroke="#E9D8C8"
                    strokeWidth="2"
                    strokeDasharray="3 7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M228 138 H340"
                    stroke="#E9D8C8"
                    strokeWidth="2"
                    strokeDasharray="3 7"
                    strokeLinecap="round"
                    fill="none"
                    opacity=".6"
                  />

                  {/* brightness graph */}
                  <line x1="40" y1="345" x2="560" y2="345" stroke="#D9CCC4" strokeWidth="1.5" opacity=".5" />
                  <path
                    d="M40 290 H150 L160 322 H220 L230 290 H360 L370 322 H430 L440 290 H560"
                    fill="none"
                    stroke="#E8A66A"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <text x="40" y="272" fill="#E9D8C8" fontSize="13">
                    Star's brightness
                  </text>
                  <text x="560" y="368" fill="#E9D8C8" fontSize="13" textAnchor="end">
                    Time
                  </text>
                </svg>
                {hotspots.map((spot, i) => (
                  <button
                    key={spot.tag}
                    className="hot"
                    style={{ left: spot.x, top: spot.y }}
                    aria-label={spot.tag}
                    aria-pressed={i === h}
                    onClick={() => setH(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="panel" aria-live="polite">
                <div>
                  <p className="part">{hs.tag}</p>
                  <h3>{hs.title}</h3>
                  <p className="d">{hs.text}</p>
                </div>
                <div className="metric">
                  <b>{hs.metric}</b>
                  <span>{hs.label}</span>
                </div>
              </div>
            </div>
            <figure className="shot">
              <img
                src={photos.surface.src}
                alt={photos.surface.alt}
                loading="lazy"
              />
              <figcaption>{photos.surface.caption}</figcaption>
            </figure>
          </div>
        </section>

        <section id="worlds" className="planet">
          <div className="wrap">
            <h2>Thousands of new worlds</h2>
            <p className="lede">
              Kepler changed the way we understand our galaxy. It showed that
              planets are incredibly common, some smaller than Earth and others
              much larger than Jupiter, and that some stars have several
              planets orbiting them.
            </p>
            <div className="big">
              <b>2,600+</b>
              <p>
                Exoplanets discovered by Kepler: planets that orbit stars
                outside our solar system.
              </p>
            </div>
            <figure className="shot">
              <img
                src={photos.banner.src}
                alt={photos.banner.alt}
                loading="lazy"
              />
              <figcaption>{photos.banner.caption}</figcaption>
            </figure>
            <div className="notes">
              <div>
                <h3>A size we don't have</h3>
                <p>
                  The most common planet size Kepler found is between Earth and
                  Neptune, a size missing from our own solar system.
                </p>
              </div>
              <div>
                <h3>The Habitable Zone</h3>
                <p>
                  Many stars may have small, possibly rocky planets where
                  liquid water could exist. That does not mean life is there,
                  but it gives scientists places to investigate.
                </p>
              </div>
              <div>
                <h3>Systems of planets</h3>
                <p>
                  Some stars have several planets, like the six of the
                  Kepler-11 system announced in 2011.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="k2" className="light">
          <div className="wrap">
            <h2>An unexpected problem, a second chance</h2>
            <p className="lede">
              In 2013, Kepler lost its direction. Reaction wheels keep a
              spacecraft pointed without rocket engines, and Kepler needed at
              least three working wheels to aim at its targets.
            </p>
            <div className="big">
              <b>19</b>
              <p>
                Observation campaigns completed by the K2 mission, when
                scientists had originally expected only 10.
              </p>
            </div>
            <div className="notes">
              <div>
                <h3>Two wheels lost</h3>
                <p>
                  One wheel had already stopped working. In May 2013 a second
                  one failed, and Kepler could no longer watch its original
                  region of the sky.
                </p>
              </div>
              <div>
                <h3>Sunlight to the rescue</h3>
                <p>
                  Engineers used the pressure of sunlight to help keep the
                  spacecraft stable and pointed in the right direction.
                </p>
              </div>
              <div>
                <h3>More than planets</h3>
                <p>
                  K2 kept searching for planets, and it also studied other
                  objects in space.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="tess" className="tl-band">
          <div className="wrap">
            <h2>Passing the torch to TESS</h2>
            <p className="lede">
              TESS, the Transiting Exoplanet Survey Satellite, launched on
              April 18, 2018, before Kepler officially retired on October 30.
              It continues the search with a different strategy.
            </p>
            <div className="pair">
              <div>
                <div className="txt">
                  <p className="role">Kepler</p>
                  <h3>One small region, for years</h3>
                  <p>
                    Kepler watched one small region of the sky, studying
                    thousands of stars at once.
                  </p>
                </div>
              </div>
              <div>
                <div className="txt">
                  <p className="role">TESS</p>
                  <h3>Much larger areas of sky</h3>
                  <p>
                    TESS surveys an area about 400 times larger than Kepler's
                    original survey, searching around 200,000 of the brightest
                    stars near our Sun. They are 30 to 100 times brighter than
                    the stars Kepler and K2 studied, so other telescopes can
                    study their planets more easily.
                  </p>
                </div>
              </div>
            </div>
            <div className="verdict">
              <h3>Kepler opened the door</h3>
              <p>
                TESS continued the search, and future telescopes such as the
                James Webb Space Telescope can study some of these distant
                worlds in greater detail. Sometimes, discovering a new world
                doesn't require visiting it.
              </p>
            </div>
          </div>
        </section>

        <section id="glossary">
          <div className="wrap">
            <h2>Words to know</h2>
            <p className="lede">
              A few mission terms you will meet in the quiz.
            </p>
            <dl className="gloss">
              {glossary.map((g) => (
                <div key={g.term}>
                  <dt>{g.term}</dt>
                  {g.full && <span className="full">{g.full}</span>}
                  <dd>{g.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <Quiz
          cardId="kepler"
          title="Kepler — Space Discovery Quiz"
          questions={quiz}
          intro="Answer all five questions about the mission. Get them right and you earn this card’s star."
        />
      </main>

      <footer>
        <div className="wrap">
          ACCIOverse · Planetary Journeys · Based on the NASA Kepler mission.
          Illustrations are simplified and not to scale.
        </div>
      </footer>
    </div>
  );
}