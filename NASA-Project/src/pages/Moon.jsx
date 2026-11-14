import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
// Replace these with your four Apollo 15 images (same folder, same format as the Pioneer ones).
import img1 from "../../assets/img/moon1.jpeg";
import img2 from "../../assets/img/moon2.jpeg";
import img3 from "../../assets/img/moon3.jpeg";
import img4 from "../../assets/img/moon4.jpeg";
import { Navigate } from "react-router-dom";
import Quiz from "../features/quiz/Quiz";
import { isQuizDone } from "../utils/quizProgress";

/* Edit the alt text / captions here to describe each photo. */
const photos = {
  hero: { src: img1, alt: "Apollo 15 astronaut on the lunar surface" },
  plan: { src: img2, alt: "The Falcon descent stage on the Moon" },
  craft: { src: img3, alt: "The Falcon ascent stage lifting off from the Moon" },
  surface: {
    src: img4,
    alt: "The Apollo 15 ALSEP instruments on the lunar surface",
    caption: "ALSEP: a scientific laboratory left on the Moon.",
  },
  // only 4 images exist, so the banner reuses the hero photo
  banner: {
    src: img1,
    alt: "Apollo 15 exploring the Moon",
    caption: "Three spacewalks, about 27.9 kilometres explored.",
  },
};

const milestones = [
  {
    date: "26 Jul 1971",
    title: "Liftoff",
    text: "A giant Saturn V rocket launches from Earth, carrying three astronauts: David Scott, James Irwin and Alfred Worden.",
  },
  {
    date: "30 Jul 1971",
    title: "Falcon lands",
    text: "The landing spacecraft Falcon touches down near the Apennine Mountains. Scott and Irwin are standing on the Moon, while Worden stays in orbit.",
  },
  {
    date: "31 Jul 1971",
    title: "The first Moonwalk",
    text: "The first of three spacewalks (EVAs) begins. Over the mission, the astronauts spend 18 hours and 35 minutes exploring outside.",
  },
  {
    date: "2 Aug 1971",
    title: "Time to go home",
    text: "After 66 hours and 55 minutes on the Moon, Scott and Irwin lift off in Falcon's upper stage and meet Worden in lunar orbit.",
  },
  {
    date: "30 Sep 1977",
    title: "ALSEP's final data",
    text: "The instruments left behind send their last scientific data to Earth, years after the astronauts went home.",
  },
];

const hotspots = [
  {
    x: "20%",
    y: "72%",
    tag: "Seismometer",
    title: "Listening for Moonquakes",
    text: "One of seven instruments joined to a central station by cables. It listened for Moonquakes and sent what it heard back to scientists on Earth.",
    metric: "7",
    label: "Instruments connected to the central station",
  },
  {
    x: "80%",
    y: "75%",
    tag: "Magnetometer",
    title: "Reading the Moon's magnetic field",
    text: "The magnetometer studied the Moon's magnetic field. Other instruments measured particles from the Sun, tiny amounts of lunar dust, the Moon's atmosphere, and heat coming from deep inside.",
    metric: "30 Sep 1977",
    label: "When ALSEP sent its final data",
  },
  {
    x: "77%",
    y: "30%",
    tag: "RTG power source",
    title: "Power without a plug",
    text: "Inside the RTG, Plutonium-238 naturally gives off heat, and the generator turns that heat into electricity. That is how the laboratory worked with no one there to charge it.",
    metric: "≈70 W",
    label: "Electrical power produced by the RTG",
  },
];

const glossary = [
  {
    term: "EVA",
    full: "Extra-Vehicular Activity",
    text: "Activities performed by astronauts outside their spacecraft.",
  },
  {
    term: "ALSEP",
    full: "Apollo Lunar Surface Experiments Package",
    text: "Scientific instruments left on the Moon to study it.",
  },
  {
    term: "RTG",
    full: "Radioisotope Thermoelectric Generator",
    text: "A device that converts radioactive heat into electricity.",
  },
  {
    term: "Plutonium-238",
    full: "",
    text: "A radioactive material that produces heat as it decays.",
  },
];

const quiz = [
  {
    q: "What happened when David Scott dropped a hammer and a feather on the Moon?",
    options: [
      "The hammer fell first",
      "The feather fell first",
      "They hit the ground at the same time",
      "Neither object fell",
    ],
    answer: 2,
  },
  {
    q: "What was the name of the spacecraft that carried David Scott and James Irwin to the Moon's surface?",
    options: ["Pioneer 10", "Saturn V", "Lunar Rover", "Falcon"],
    answer: 3,
  },
  {
    q: "What was special about the Lunar Roving Vehicle (LRV) on Apollo 15?",
    options: [
      "It launched the spacecraft into orbit",
      "It was the first vehicle used to explore the Moon",
      "It collected solar energy for Earth",
      "It carried astronauts back to Earth",
    ],
    answer: 1,
  },
  {
    q: "Why did the astronauts leave ALSEP instruments on the Moon?",
    options: [
      "To help future spacecraft land",
      "To send astronauts messages",
      "To study the Moon and send scientific data to Earth",
      "To mark the landing location",
    ],
    answer: 2,
  },
  {
    q: "ALSEP needed electricity to keep working after the astronauts left. How did its RTG generate electrical power?",
    options: [
      "By storing electricity from the astronauts' spacesuits",
      "By converting heat from Plutonium-238 into electricity",
      "By collecting sunlight with solar panels",
      "By burning ordinary rocket fuel",
    ],
    answer: 1,
  },
];

// TODO: replace with the Apollo 15 video's YouTube ID
const YOUTUBE_ID = "YOUR_YOUTUBE_ID";
const VIDEO_URL = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=IBM+Plex+Sans:wght@400;500&display=swap');
html{scroll-behavior:smooth}
.vk{--bg:#E6ECF2;--surface:#FFFFFF;--text:#16212E;--muted:#56677A;--line:#C8D3DF;--accent:#2F5F8F;--band:#141D2B;--band-text:#E4ECF5;
  --display:"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif;--body:"IBM Plex Sans","Helvetica Neue",Arial,sans-serif;
  background:var(--bg);color:var(--text);font:400 17px/1.65 var(--body);-webkit-font-smoothing:antialiased;min-height:100vh}
@media (prefers-color-scheme:dark){.vk{--bg:#0E1520;--surface:#161F2D;--text:#E6EEF7;--muted:#9AAABD;--line:#2A3A4F;--accent:#8DB8E8;--band:#080D15;--band-text:#E4ECF5}}
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
.vk .hero{position:relative;min-height:92vh;display:flex;align-items:flex-end;overflow:hidden;background:#141D2B}
.vk .hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.vk .hero::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(8,14,24,.82) 0%,rgba(8,14,24,.45) 45%,rgba(8,14,24,.15) 100%)}
.vk .hero .wrap{position:relative;z-index:1;width:100%;color:#EAF1F9;padding-top:72px;padding-bottom:72px}
.vk .hero h1{font-size:clamp(3.2rem,11vw,8.5rem);font-weight:800;line-height:.92;letter-spacing:-.04em;max-width:9ch}
.vk .sub{margin-top:24px;font-size:1.25rem;max-width:34ch;font-weight:500}
.vk .btn{display:inline-block;margin-top:28px;background:#EAF1F9;color:#14202E;text-decoration:none;font-weight:500;padding:14px 26px;border-radius:999px}
.vk .btn:hover{background:#fff}
.vk .btn .play{display:inline-grid;place-items:center;width:26px;height:26px;margin-right:10px;border-radius:50%;background:var(--accent);color:#fff;font-size:.65rem;padding-left:2px;vertical-align:middle}
.vk .watch-hint{margin-top:12px;font-size:.92rem;opacity:.85}
@media(prefers-reduced-motion:no-preference){.vk .btn .play{animation:vkpulse 2.4s infinite}}

.vk .facts{background:var(--band);color:var(--band-text)}
.vk .facts dl{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin:0;padding:28px 0}
.vk .facts dt{font-size:.8rem;opacity:.7}
.vk .facts dd{margin:4px 0 0;font:800 1.5rem var(--display)}
@media(max-width:700px){.vk .facts dl{grid-template-columns:1fr 1fr}}

/* Plan / Spacecraft with photos */
.vk .pair{display:grid;grid-template-columns:1fr 1fr;margin-top:48px;border:1px solid var(--line);border-radius:20px;overflow:hidden;background:var(--surface)}
.vk .pair>div{display:flex;flex-direction:column}
.vk .pair>div+div{border-left:1px solid var(--line)}
.vk .pair img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}
.vk .pair .txt{padding:36px}
.vk .role{color:var(--accent);font-weight:500;font-size:.9rem;margin-bottom:10px}
.vk .pair .txt p:not(.role){color:var(--muted);margin-top:12px}
.vk .verdict{margin-top:24px;padding:28px 36px;border-radius:20px;background:var(--band);color:var(--band-text)}
.vk .verdict p{max-width:70ch;margin-top:8px;opacity:.85}
@media(max-width:700px){.vk .pair{grid-template-columns:1fr}.vk .pair>div+div{border-left:0;border-top:1px solid var(--line)}}

.vk .tl-band{background:var(--surface);border-block:1px solid var(--line)}
.vk .tl{margin-top:48px}
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
@media(max-width:700px){.vk .tl-detail{grid-template-columns:1fr;gap:12px}.vk .tl-btn{font-size:.75rem}}

.vk .lab{display:grid;grid-template-columns:1.5fr 1fr;gap:24px;margin-top:48px;align-items:stretch}
.vk .stage{position:relative;border-radius:20px;background:#141D2B;overflow:hidden;aspect-ratio:3/2}
.vk .stage svg{width:100%;height:100%;display:block}
.vk .hot{all:unset;cursor:pointer;position:absolute;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;background:#8DB8E8;color:#0E1A2B;font:800 .95rem var(--display);display:grid;place-items:center}
.vk .hot[aria-pressed="true"]{background:#fff;box-shadow:0 0 0 8px rgba(255,255,255,.28)}
.vk .hot:focus-visible{outline:3px solid #fff;outline-offset:3px}
@media(prefers-reduced-motion:no-preference){.vk .hot:not([aria-pressed="true"]){animation:vkpulse 2.4s infinite}}
@keyframes vkpulse{0%{box-shadow:0 0 0 0 rgba(141,184,232,.6)}70%{box-shadow:0 0 0 12px rgba(141,184,232,0)}100%{box-shadow:0 0 0 0 rgba(141,184,232,0)}}
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
.vk .big b{font:800 clamp(5rem,18vw,12rem) var(--display);line-height:.8;letter-spacing:-.05em;color:#8DB8E8}
.vk .big p{max-width:34ch;opacity:.85}
.vk .notes{display:grid;grid-template-columns:repeat(3,1fr);margin-top:64px;border-top:1px solid rgba(255,255,255,.18)}
.vk .notes div{padding:28px 28px 0 0}
.vk .notes div+div{padding-left:28px;border-left:1px solid rgba(255,255,255,.18)}
.vk .notes h3{font-size:1.15rem}
.vk .notes p{opacity:.72;margin-top:8px;font-size:.95rem}
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

export default function Moon() {
  const [m, setM] = useState(0);
  const [h, setH] = useState(0);
  const hs = hotspots[h];
  const ms = milestones[m];

  const section = useRef(null);
  // checked once on page load (not live), so the quiz can still show its
  // success message before it sends the user back to the slider
  const [alreadyDone] = useState(() => isQuizDone("lrv"));
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

  // one instrument on a stand, reused for the seismometer and magnetometer
  const cable = (d) => (
    <path d={d} stroke="#8DB8E8" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="2 7" />
  );

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
            <h1>Apollo 15</h1>
            <p className="sub">
              Our adventure on the Moon. A hammer and a feather, dropped
              together, hit the ground at the same time.
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
              aria-label="Apollo 15 mission video"
            >
              {/* stopPropagation: clicking the video itself must not close it */}
              <div className="video-modal" onClick={(e) => e.stopPropagation()}>
                <iframe
                  src={VIDEO_URL}
                  title="Apollo 15 mission"
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
                <dd>26 Jul 1971</dd>
              </div>
              <div>
                <dt>Moon landing</dt>
                <dd>30 Jul 1971</dd>
              </div>
              <div>
                <dt>Time on the Moon</dt>
                <dd>66 h 55 min</dd>
              </div>
              <div>
                <dt>ALSEP final data</dt>
                <dd>30 Sep 1977</dd>
              </div>
            </dl>
          </div>
        </div>

        <section id="story" ref={section}>
          <div className="wrap">
            <h2>Two astronauts on the Moon, one in orbit</h2>
            <p className="lede">
              Apollo 15 was a mission to explore more. David Scott and James
              Irwin landed near the Apennine Mountains in a spacecraft named
              Falcon, while Alfred Worden stayed in orbit around the Moon.
            </p>
            <div className="pair">
              <div>
                <img
                  src={photos.plan.src}
                  alt={photos.plan.alt}
                  loading="lazy"
                />
                <div className="txt">
                  <p className="role">The lower part</p>
                  <h3>The Descent Stage</h3>
                  <p>
                    It helps the spacecraft land safely and carries the
                    equipment needed on the Moon. When it's time to leave, this
                    stage stays behind.
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
                  <p className="role">The upper part</p>
                  <h3>The Ascent Stage</h3>
                  <p>
                    It carries the astronauts back into space, where they
                    meet Worden in the Command and Service Module.
                  </p>
                </div>
              </div>
            </div>
            <div className="verdict">
              <h3>The hammer and the feather</h3>
              <p>
                On Earth, the hammer lands first. On the Moon, David Scott
                dropped both together and they hit the ground at the same time.
                The Moon has almost no atmosphere, so there is no air to slow
                the feather down.
              </p>
            </div>
          </div>
        </section>

        <section id="journey" className="tl-band">
          <div className="wrap">
            <h2>From launch to the last signal</h2>
            <p className="lede">
              Select a date to follow Apollo 15 from liftoff to its final
              scientific data.
            </p>
            <div className="tl">
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
            <h2>The laboratory we left behind</h2>
            <p className="lede">
              Tap a numbered point to see how ALSEP listened for Moonquakes,
              studied the Moon, and kept working without anyone to charge it.
            </p>
            <div className="lab">
              <div className="stage">
                <svg
                  viewBox="0 0 600 400"
                  role="img"
                  aria-label="Simplified drawing of the ALSEP central station connected by cables to a seismometer, a magnetometer and an RTG"
                >
                  <defs>
                    <linearGradient id="apg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#1E2A3B" />
                      <stop offset="1" stopColor="#2E4560" />
                    </linearGradient>
                  </defs>
                  <rect width="600" height="400" fill="url(#apg)" />
                  {/* lunar ground */}
                  <path
                    d="M0 330 Q150 310 300 328 T600 322 L600 400 L0 400 Z"
                    fill="#B9C6D6"
                    opacity=".18"
                  />
                  <ellipse cx="300" cy="372" rx="200" ry="12" fill="rgba(0,0,0,.35)" />

                  {/* cables to instruments */}
                  {cable("M270 235 Q200 300 130 285")}
                  {cable("M330 235 Q410 300 470 295")}
                  {cable("M330 205 Q400 150 440 130")}

                  {/* central station */}
                  <rect x="255" y="190" width="90" height="56" rx="8" fill="#B9C6D6" />
                  <line x1="255" y1="214" x2="345" y2="214" stroke="rgba(20,29,43,.4)" />
                  <circle cx="275" cy="230" r="4" fill="#8DB8E8" />
                  <circle cx="295" cy="230" r="4" fill="#8DB8E8" />
                  {/* antenna */}
                  <g stroke="#D5E0EC" strokeWidth="4" fill="none" strokeLinecap="round">
                    <path d="M300 190 L300 130" />
                  </g>
                  <ellipse cx="300" cy="118" rx="38" ry="16" fill="#DCE5EF" stroke="#B9C6D6" strokeWidth="2" />

                  {/* seismometer: low dome */}
                  <path d="M95 300 Q130 255 165 300 Z" fill="#DCE5EF" stroke="#B9C6D6" strokeWidth="3" />
                  <rect x="90" y="298" width="80" height="8" rx="3" fill="#B9C6D6" />

                  {/* magnetometer: box on a stand */}
                  <g stroke="#D5E0EC" strokeWidth="4" strokeLinecap="round">
                    <line x1="470" y1="300" x2="455" y2="335" />
                    <line x1="470" y1="300" x2="485" y2="335" />
                  </g>
                  <rect x="445" y="272" width="50" height="30" rx="5" fill="#DCE5EF" stroke="#B9C6D6" strokeWidth="3" />

                  {/* RTG: finned cylinder */}
                  <g transform="translate(460 120)">
                    <rect x="-14" y="-34" width="28" height="68" rx="6" fill="#26364A" stroke="#D5E0EC" strokeWidth="2" />
                    <g stroke="#8DB8E8" strokeWidth="2">
                      {[-24, -10, 4, 18].map((y) => (
                        <g key={y}>
                          <line x1="-18" y1={y} x2="-28" y2={y} />
                          <line x1="18" y1={y} x2="28" y2={y} />
                        </g>
                      ))}
                    </g>
                  </g>
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

        <section id="moon" className="planet">
          <div className="wrap">
            <h2>Three trips, countless discoveries</h2>
            <p className="lede">
              The astronauts completed three spacewalks, called EVAs. They
              visited craters, studied the lunar ground, and rode the first
              Moon car to places far from their landing site.
            </p>
            <div className="big">
              <b>27.9</b>
              <p>
                Kilometres explored across the three spacewalks, using the
                Lunar Roving Vehicle to reach craters and collect samples.
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
                <h3>The first lunar rover</h3>
                <p>
                  Apollo 15 was the first mission to use the four-wheeled
                  Lunar Roving Vehicle, or LRV.
                </p>
              </div>
              <div>
                <h3>77.31 kg of the Moon</h3>
                <p>
                  Rocks and soil collected, including a sample from about three
                  metres below the surface.
                </p>
              </div>
              <div>
                <h3>18 h 35 min outside</h3>
                <p>
                  Time Scott and Irwin spent exploring on foot and by rover
                  before leaving ALSEP behind.
                </p>
              </div>
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
          cardId="lrv"
          title="Apollo 15 — Moon Adventure Quiz"
          questions={quiz}
          intro="Answer all five questions about the mission. Get them right and you earn this card’s star."
        />
      </main>

      <footer>
        <div className="wrap">
          ACCIOverse · Planetary Journeys · Based on the NASA Apollo 15
          mission. Illustrations are simplified and not to scale.
        </div>
      </footer>
    </div>
  );
}