import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import img1 from "../../assets/img/pioneer1.jpeg";
import img2 from "../../assets/img/pioneer2.jpeg";
import img3 from "../../assets/img/pioneer3.jpeg";
import img4 from "../../assets/img/pioneer4.jpeg";
import { Navigate } from "react-router-dom";
import Quiz from "../features/quiz/Quiz";
import { isQuizDone } from "../utils/quizProgress";

/* Edit the alt text / captions here to describe each photo. */
const photos = {
  hero: { src: img1, alt: "Pioneer 10 departing toward Jupiter" },
  plan: { src: img2, alt: "The Atlas-Centaur rocket lifting off" },
  craft: {
    src: img3,
    alt: "The Pioneer 10 spacecraft with its dish and power booms",
  },
  surface: {
    src: img4,
    alt: "Jupiter's cloud bands photographed by Pioneer 10",
    caption:
      "The first close-up pictures ever taken of Jupiter, November–December 1973.",
  },
  // only 4 images exist, so the banner reuses the hero photo
  banner: {
    src: img1,
    alt: "Pioneer 10 receding into deep space",
    caption: "Silent since 2003, still coasting toward the star Aldebaran.",
  },
};

const milestones = [
  {
    date: "2 Mar 1972",
    title: "The fastest ride yet",
    text: "An Atlas-Centaur rocket lifts Pioneer 10 away from Cape Canaveral, bound for Jupiter — the largest planet in our Solar System.",
  },
  {
    date: "Jul 1972 – Feb 1973",
    title: "Through the rock road",
    text: "Crosses the main asteroid belt between Mars and Jupiter — the first spacecraft ever to make the trip, with fewer hits than feared.",
  },
  {
    date: "4 Dec 1973",
    title: "The giant up close",
    text: "Closest approach at about 81,000 miles and nearly 78,000 mph. Around 500 pictures, and the first photos of three large moons.",
  },
  {
    date: "23 Jan 2003",
    title: "One last hello",
    text: "A final signal arrives from about 7.6 billion miles away, 11 hours and 20 minutes in transit. The journey itself continues.",
  },
];

const hotspots = [
  {
    x: "50%",
    y: "20%",
    tag: "High-gain antenna dish",
    title: "A voice across billions",
    text: "The 2.74-metre dish pointed at Earth for over thirty years, carrying every picture and every measurement home across empty space.",
    metric: "11 h 20 m",
    label: "One-way travel time of the final signal",
  },
  {
    x: "25%",
    y: "77%",
    tag: "RTG power booms",
    title: "Power for the dark",
    text: "Two nuclear generators turned the heat of plutonium-238 into electricity. As the fuel slowly decayed, the power faded — until the radio fell silent.",
    metric: "≈140 W",
    label: "Electrical power during the Jupiter encounter",
  },
  {
    x: "54%",
    y: "55%",
    tag: "The Pioneer plaque",
    title: "A message in gold",
    text: "A gold-plated drawing of a man and a woman, our Solar System, and 14 pulsars marking the Sun's location — a note to whoever finds it: “We are here!”",
    metric: "2 M yrs",
    label: "Until it drifts past the star Aldebaran",
  },
];

const quiz = [
  {
    q: "What was Pioneer 10's main destination?",
    options: ["Mars", "Jupiter", "Saturn", "The Moon"],
    answer: 1,
  },
  {
    q: "What was the purpose of the golden plaque carried by Pioneer 10?",
    options: [
      "To show directions to Jupiter",
      "To record scientific experiments",
      "To send a message about humans and Earth",
      "To communicate with NASA",
    ],
    answer: 2,
  },
  {
    q: "How did Pioneer 10 generate electricity during its journey?",
    options: [
      "Using sunlight",
      "Using batteries only",
      "Using Jupiter's magnetic field",
      "Using heat from Plutonium-238",
    ],
    answer: 3,
  },
  {
    q: "Why was Pioneer 10's journey through the Asteroid Belt an important achievement?",
    options: [
      "It was the first spacecraft to cross the main Asteroid Belt successfully",
      "It discovered a new planet",
      "It landed on an asteroid",
      "It collected samples from asteroids",
    ],
    answer: 0,
  },
  {
    q: "Why did Pioneer 10 eventually stop sending signals to Earth?",
    options: [
      "It crashed into an asteroid",
      "It entered Jupiter's atmosphere",
      "Its power supply became too weak to operate its transmitter",
      "It reached another star",
    ],
    answer: 2,
  },
];

const YOUTUBE_ID = "DOaZmDmSm8Y";
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
@media(max-width:800px){.vk .big{grid-template-columns:1fr;gap:20px}.vk .notes{grid-template-columns:1fr}.vk .notes div,.vk .notes div+div{padding:24px 0 0;border-left:0}}
.vk footer{padding:32px 0;color:var(--muted);font-size:.85rem;border-top:1px solid var(--line)}
`;

export default function Pioneer() {
  const [m, setM] = useState(0);
  const [h, setH] = useState(0);
  const hs = hotspots[h];
  const ms = milestones[m];

  const section = useRef(null);
  // checked once on page load (not live), so the quiz can still show its
  // success message before it sends the user back to the slider
  const [alreadyDone] = useState(() => isQuizDone("pioneer-10"));
  // video popup (same behaviour as the Hero popup on the home page)
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  function openVideo(e) {
    e.preventDefault();
    setIsVideoOpen(true);
  }

  // closing the popup scrolls down to the story section (the button's old job)
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

  const rtg = (
    <>
      <rect
        x="-12"
        y="-40"
        width="24"
        height="60"
        rx="6"
        fill="#4A3028"
        stroke="#E9D8C8"
        strokeWidth="2"
      />
      <g stroke="#E8A66A" strokeWidth="2">
        {[-32, -16, 0, 12].map((y) => (
          <g key={y}>
            <line x1="-16" y1={y} x2="-26" y2={y} />
            <line x1="16" y1={y} x2="26" y2={y} />
          </g>
        ))}
      </g>
    </>
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
            <h1>The first road to Jupiter</h1>
            <p className="sub">
              In 1972, no spacecraft had ever left the inner planets. Pioneer 10
              went anyway.
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
              aria-label="Pioneer 10 mission video"
            >
              {/* stopPropagation: clicking the video itself must not close it */}
              <div className="video-modal" onClick={(e) => e.stopPropagation()}>
                <iframe
                  src={VIDEO_URL}
                  title="Pioneer 10 mission"
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
                <dd>2 Mar 1972</dd>
              </div>
              <div>
                <dt>Jupiter flyby</dt>
                <dd>4 Dec 1973</dd>
              </div>
              <div>
                <dt>Worked for</dt>
                <dd>30+ years</dd>
              </div>
              <div>
                <dt>Last signal</dt>
                <dd>23 Jan 2003</dd>
              </div>
            </dl>
          </div>
        </div>

        <section id="story" ref={section}>
          <div className="wrap">
            <h2>One modest craft, two impossible firsts</h2>
            <p className="lede">
              Scientists wanted a close look at Jupiter, but between Earth and
              the giant planet lay the uncharted asteroid belt. NASA built
              Pioneer 10 — just 258 kg — to make the trip anyway. Planned for at
              least 21 months, it kept answering for more than thirty years.
            </p>
            <div className="pair">
              <div>
                <img
                  src={photos.plan.src}
                  alt={photos.plan.alt}
                  loading="lazy"
                />
                <div className="txt">
                  <p className="role">The plan</p>
                  <h3>A flyby, not a landing</h3>
                  <p>
                    Ride an Atlas-Centaur rocket outward, cross the asteroid
                    belt, then sweep past Jupiter close enough to study its
                    clouds, radiation, and magnetic field — and radio everything
                    home.
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
                  <p className="role">The spacecraft</p>
                  <h3>A laboratory that spins</h3>
                  <p>
                    A 2.74-metre dish for a voice, two nuclear generators for
                    power, 11 scientific instruments, and a gold plaque bolted
                    to its side.
                  </p>
                </div>
              </div>
            </div>
            <div className="verdict">
              <h3>The verdict on the journey</h3>
              <p>
                No landing, no stopping, no return. Pioneer 10 became the first
                human-made object to cross the asteroid belt and the first to
                visit Jupiter — then simply kept going, carrying a message for
                whoever finds it.
              </p>
            </div>
          </div>
        </section>

        <section id="journey" className="tl-band">
          <div className="wrap">
            <h2>21 months planned. Over 30 years achieved.</h2>
            <p className="lede">
              Select a moment to follow Pioneer 10 from launch to its final
              message.
            </p>
            <div className="tl">
              <div
                className="tl-track"
                role="tablist"
                aria-label="Mission milestones"
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
            <h2>Small craft, extraordinary reach</h2>
            <p className="lede">
              Tap a numbered point to see how Pioneer 10 phoned home, made power
              in the dark, and carried a message from Earth.
            </p>
            <div className="lab">
              <div className="stage">
                <svg
                  viewBox="0 0 600 400"
                  role="img"
                  aria-label="Simplified drawing of the Pioneer 10 spacecraft"
                >
                  <defs>
                    <linearGradient id="pkg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#3B2A24" />
                      <stop offset="1" stopColor="#5A3326" />
                    </linearGradient>
                  </defs>
                  <rect width="600" height="400" fill="url(#pkg)" />
                  {/* ground shadow */}
                  <ellipse
                    cx="300"
                    cy="372"
                    rx="180"
                    ry="12"
                    fill="rgba(0,0,0,.35)"
                  />
                  {/* instrument booms */}
                  <g
                    stroke="#E9D8C8"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  >
                    <path d="M300 240 L160 330" />
                    <path d="M300 240 L440 330" />
                  </g>
                  <circle cx="158" cy="332" r="7" fill="#E8A66A" />
                  <circle cx="442" cy="332" r="7" fill="#E8A66A" />
                  {/* RTG booms */}
                  <g transform="translate(150 310) rotate(38)">{rtg}</g>
                  <g transform="translate(450 310) rotate(-38)">{rtg}</g>
                  {/* equipment compartment */}
                  <rect
                    x="262"
                    y="208"
                    width="76"
                    height="48"
                    rx="8"
                    fill="#CFC3B8"
                  />
                  <line
                    x1="262"
                    y1="232"
                    x2="338"
                    y2="232"
                    stroke="rgba(42,32,28,.4)"
                  />
                  {/* plaque */}
                  <rect
                    x="318"
                    y="212"
                    width="12"
                    height="17"
                    rx="2"
                    fill="#E8C97A"
                    stroke="#8A6F2C"
                  />
                  {/* dish support struts */}
                  <g
                    stroke="#E9D8C8"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  >
                    <path d="M268 208 L255 150" />
                    <path d="M332 208 L345 150" />
                    <path d="M300 208 L300 146" />
                  </g>
                  {/* high-gain dish */}
                  <ellipse cx="300" cy="120" rx="105" ry="42" fill="#E9DED4" />
                  <ellipse
                    cx="300"
                    cy="120"
                    rx="105"
                    ry="42"
                    fill="none"
                    stroke="#CFC3B8"
                    strokeWidth="3"
                  />
                  <ellipse
                    cx="300"
                    cy="120"
                    rx="72"
                    ry="28"
                    fill="none"
                    stroke="#CFC3B8"
                    strokeWidth="2.5"
                  />
                  <ellipse
                    cx="300"
                    cy="120"
                    rx="40"
                    ry="15"
                    fill="none"
                    stroke="#CFC3B8"
                    strokeWidth="2"
                  />
                  <circle cx="300" cy="120" r="7" fill="#2A201C" />
                  <path
                    d="M205 112 A105 42 0 0 1 300 78"
                    fill="none"
                    stroke="#E8A66A"
                    strokeWidth="3"
                  />
                  <line
                    x1="300"
                    y1="120"
                    x2="300"
                    y2="150"
                    stroke="#2A201C"
                    strokeWidth="3"
                  />
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

        <section id="planet" className="planet">
          <div className="wrap">
            <h2>A giant seen for the first time</h2>
            <p className="lede">
              Pioneer 10 measured Jupiter's fierce radiation and enormous
              magnetic field, photographed its swirling cloud bands, and caught
              the first-ever spacecraft views of three large moons — then sailed
              on past Neptune's orbit.
            </p>
            <div className="big">
              <b>81,000</b>
              <p>
                Miles from Jupiter's cloud tops at closest approach — traveled
                at nearly 78,000 mph, faster than any spacecraft had ever moved.
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
                <h3>The Jupiter encounter</h3>
                <p>
                  About 500 pictures taken between November 6 and December 4,
                  1973 — humanity's first close look at the largest planet.
                </p>
              </div>
              <div>
                <h3>Three moons photographed</h3>
                <p>
                  Callisto, Ganymede and Europa were imaged by a spacecraft for
                  the very first time.
                </p>
              </div>
              <div>
                <h3>Beyond the planets</h3>
                <p>
                  First past Neptune's orbit in 1983, heading for the star
                  Aldebaran — expected arrival: about two million years.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Quiz
          cardId="pioneer-10"
          questions={quiz}
          intro="Answer all five questions about the mission. Get them right and you earn this card’s star."
        />
      </main>

      <footer>
        <div className="wrap">
          ACCIOverse · Planetary Journeys · Based on the NASA Pioneer 10
          mission. Illustrations are simplified and not to scale.
        </div>
      </footer>
    </div>
  );
}
