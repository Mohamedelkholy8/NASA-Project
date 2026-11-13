import { useRef, useState } from "react";
import img1 from "../../assets/img/mars1.jpeg";
import img2 from "../../assets/img/mars2.jpeg";
import img3 from "../../assets/img/mars3.jpeg";
import img4 from "../../assets/img/mars4.jpeg";
import img5 from "../../assets/img/mars5.jpeg";
import { Navigate } from "react-router-dom";
import Quiz from "../features/quiz/Quiz";
import { isQuizDone } from "../utils/quizProgress";

/* Edit the alt text / captions here to describe each photo. */
const photos = {
  hero: { src: img1, alt: "Martian landscape under a dusty sky" },
  orbiter: { src: img2, alt: "Mars seen from orbit" },
  lander: { src: img3, alt: "The Viking 1 Lander on the Martian surface" },
  surface: {
    src: img4,
    alt: "Rocks and soil on the surface of Mars",
    caption: "The ground around the Lander, photographed from the surface.",
  },
  banner: {
    src: img5,
    alt: "Wide view of the Martian terrain",
    caption: "Mars: a cold desert that may once have had flowing water.",
  },
};

const milestones = [
  {
    date: "20 Aug 1975",
    title: "Journey to the Red Planet",
    text: "Viking 1 leaves Earth and travels through space for about 10 months.",
  },
  {
    date: "19 Jun 1976",
    title: "Orbital arrival",
    text: "Reaches Mars orbit. The Orbiter takes pictures and looks for a safe place for its partner, the Lander.",
  },
  {
    date: "20 Jul 1976",
    title: "The big landing",
    text: "Lands safely on Chryse Planitia, the Golden Plain, and sends the first pictures ever taken from the Martian surface.",
  },
  {
    date: "11 Nov 1982",
    title: "End of an amazing journey",
    text: "Planned for only 90 days, the Lander works for over 6 years before sending its final message to Earth.",
  },
];

const hotspots = [
  {
    x: "24%",
    y: "72%",
    tag: "Robotic sampler arm",
    title: "Let’s search for life",
    text: "A robotic arm dug into the Martian soil, collected small samples, and placed them inside an onboard science laboratory. No clear evidence of life was found.",
    metric: "0 signs",
    label: "Clear evidence of living things",
  },
  {
    x: "78%",
    y: "15%",
    tag: "Meteorology boom",
    title: "What is Mars really like?",
    text: "Built as a weather station to measure temperature, wind speed, and air pressure. It found a freezing world where temperatures drop sharply before sunrise.",
    metric: "−86°C",
    label: "Surface temperature before sunrise",
  },
  {
    x: "50%",
    y: "49%",
    tag: "Imaging system",
    title: "A new world through its eyes",
    text: "The Orbiter took thousands of pictures from space while the Lander photographed the ground, rocks, and nearby landscape, revealing signs of ancient rivers and floods.",
    metric: "6+ years",
    label: "On the surface, against a 90-day plan",
  },
];

const quiz = [
  {
    q: "What was the main mission of Viking 1?",
    options: [
      "To search for signs of life on Mars",
      "To bring humans to Mars",
      "To study Jupiter",
    ],
    answer: 0,
  },
  {
    q: "What were the two main parts of Viking 1?",
    options: ["Rocket and Satellite", "Orbiter and Lander", "Camera and Robot"],
    answer: 1,
  },
  {
    q: "Did Viking 1 find clear evidence of life on Mars?",
    options: [
      "Yes, it found living creatures",
      "No, it found no clear evidence of life",
      "It never studied the soil",
    ],
    answer: 1,
  },
];

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

.vk .facts{background:var(--band);color:var(--band-text)}
.vk .facts dl{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin:0;padding:28px 0}
.vk .facts dt{font-size:.8rem;opacity:.7}
.vk .facts dd{margin:4px 0 0;font:800 1.5rem var(--display)}
@media(max-width:700px){.vk .facts dl{grid-template-columns:1fr 1fr}}

/* Orbiter / Lander with photos */
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

.vk .mars{background:var(--band);color:var(--band-text)}
.vk .mars .lede{color:inherit;opacity:.75}
.vk .mars .shot{border-color:rgba(255,255,255,.18);background:transparent}
.vk .mars .shot figcaption{color:inherit;opacity:.72}
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

export default function Mars1() {
  const [m, setM] = useState(0);
  const [h, setH] = useState(0);
  const hs = hotspots[h];
  const ms = milestones[m];

  const section = useRef(null);
  // checked once on page load (not live), so the quiz can still show its
  // success message before it sends the user back to the slider
  const [alreadyDone] = useState(() => isQuizDone("viking-1"));
  // adding smooth scroll
  function handleScroll(e) {
    e.preventDefault();
    section.current.scrollIntoView({ behavior: "smooth" });
  }
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
            <h1>Could Mars hold life?</h1>
            <p className="sub">
              Scientists had the same question, so they sent Viking 1.
            </p>
            <a className="btn scroll" href="#" onClick={handleScroll}>
              Explore the mission
            </a>
          </div>
        </div>

        <div className="facts">
          <div className="wrap">
            <dl>
              <div>
                <dt>Launched</dt>
                <dd>20 Aug 1975</dd>
              </div>
              <div>
                <dt>Landed on Mars</dt>
                <dd>20 Jul 1976</dd>
              </div>
              <div>
                <dt>Worked for</dt>
                <dd>6+ years</dd>
              </div>
              <div>
                <dt>Last message</dt>
                <dd>11 Nov 1982</dd>
              </div>
            </dl>
          </div>
        </div>

        <section id="story" ref={section}>
          <div className="wrap">
            <h2>One mission, two machines working together</h2>
            <p className="lede">
              Scientists wanted to know if Mars could support life. NASA built
              Viking 1 as a team: an Orbiter above and a Lander below. Planned
              for 90 days, it kept working for more than six years and helped
              prepare every Mars mission that followed.
            </p>
            <div className="pair">
              <div>
                <img
                  src={photos.orbiter.src}
                  alt={photos.orbiter.alt}
                  loading="lazy"
                />
                <div className="txt">
                  <p className="role">The Orbiter</p>
                  <h3>Eyes from above</h3>
                  <p>
                    Circled Mars, took thousands of pictures from space, and
                    scouted a safe landing site for its partner.
                  </p>
                </div>
              </div>
              <div>
                <img
                  src={photos.lander.src}
                  alt={photos.lander.alt}
                  loading="lazy"
                />
                <div className="txt">
                  <p className="role">The Lander</p>
                  <h3>Boots on the ground</h3>
                  <p>
                    Touched down on Chryse Planitia to test Martian soil, track
                    the weather, and take the first photographs from the
                    surface.
                  </p>
                </div>
              </div>
            </div>
            <div className="verdict">
              <h3>The verdict on life</h3>
              <p>
                The onboard biology tests found no clear evidence of living
                things, but they uncovered a complex, ancient world.
              </p>
            </div>
          </div>
        </section>

        <section id="journey" className="tl-band">
          <div className="wrap">
            <h2>90 days planned. Over six years achieved.</h2>
            <p className="lede">
              Select a moment to follow Viking 1 from launch to its final
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
        <iframe
          className="w-[100vw] h-[80vh]"
          src="https://eyes.nasa.gov/apps/solar-system/#/mars/distance?to=earth&rate=0&time=1976-07-20T11%3A53%3A30.486+00%3A00"
          allowFullScreen
        ></iframe>
        <section id="lab">
          <div className="wrap">
            <h2>Small craft, extraordinary reach</h2>
            <p className="lede">
              Tap a numbered point to see how Viking 1 scooped soil, measured
              freezing winds, and photographed a new world.
            </p>
            <div className="lab">
              <div className="stage">
                <svg
                  viewBox="0 0 600 400"
                  role="img"
                  aria-label="Simplified drawing of the Viking 1 Lander"
                >
                  <defs>
                    <linearGradient id="vkg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#3B2A24" />
                      <stop offset="1" stopColor="#5A3326" />
                    </linearGradient>
                  </defs>
                  <rect width="600" height="400" fill="url(#vkg)" />
                  <path
                    d="M0 330 Q150 300 300 322 T600 312 V400 H0Z"
                    fill="#7A4430"
                  />
                  <g
                    stroke="#E9D8C8"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  >
                    <path d="M230 250 L170 340 M370 250 L430 340 M300 262 V345" />
                    <path
                      d="M165 340 h20 M425 340 h20 M290 346 h22"
                      strokeWidth="7"
                    />
                  </g>
                  <path
                    d="M220 170 L250 130 H350 L380 170 L380 250 H220Z"
                    fill="#CFC3B8"
                  />
                  <path d="M250 130 H350 L380 170 H220Z" fill="#E9DED4" />
                  <circle
                    cx="300"
                    cy="195"
                    r="26"
                    fill="#2A201C"
                    stroke="#E8A66A"
                    strokeWidth="4"
                  />
                  <g
                    stroke="#E9D8C8"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  >
                    <path d="M220 210 L150 250 L120 290" />
                    <path d="M370 130 L420 70 L470 62" />
                  </g>
                  <circle cx="120" cy="292" r="9" fill="#E8A66A" />
                  <circle cx="472" cy="62" r="7" fill="#E8A66A" />
                  <path
                    d="M300 130 V92 M286 92 H314"
                    stroke="#E9D8C8"
                    strokeWidth="5"
                    fill="none"
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

        <section id="mars" className="mars">
          <div className="wrap">
            <h2>A planet of possibilities</h2>
            <p className="lede">
              Viking 1 measured bitter cold, wind, and air pressure, while its
              cameras found signs of ancient rivers and floods. Maybe Mars was
              very different millions of years ago.
            </p>
            <div className="big">
              <b>−86°C</b>
              <p>
                The surface temperature just before sunrise at Chryse Planitia,
                the Golden Plain where Viking 1 landed.
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
                <h3>Chryse Planitia</h3>
                <p>
                  The first successful NASA landing on Mars, on 20 July 1976. It
                  sent back the first pictures ever taken from the Martian
                  surface.
                </p>
              </div>
              <div>
                <h3>Ancient riverbeds</h3>
                <p>
                  Orbiter images showed channels that point to massive floods
                  millions of years ago.
                </p>
              </div>
              <div>
                <h3>Martian weather</h3>
                <p>
                  Winds, air pressure, and a freezing chill before dawn,
                  recorded for more than six years.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Quiz cardId="viking-1" questions={quiz} />
      </main>

      <footer>
        <div className="wrap">
          ACCIOverse · Planetary Journeys · Based on the NASA Viking 1 mission.
          Illustrations are simplified and not to scale.
        </div>
      </footer>
    </div>
  );
}
