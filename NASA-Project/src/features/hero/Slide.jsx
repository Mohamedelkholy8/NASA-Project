// Slides.jsx
// npm i gsap
import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { resetQuizProgress, useQuizProgress } from "../../utils/quizProgress";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import astronautImg from "../../../assets/img/space-research.png";
import vikingImg from "../../../assets/img/viking-launch.jpg";

gsap.registerPlugin(ScrollTrigger);
// على الموبايل: ماتعملش refresh كل ما شريط العنوان يطلع/ينزل (بيعمل نط في الـ pin)
ScrollTrigger.config({ ignoreMobileResize: true });

/* ---------- Content: edit freely. Add `image: "/your.jpg"` to use a photo ---------- */
const SLIDES = [
  // ---- Mars ----
  {
    id: "viking-1",
    group: "Mars",
    title: "Viking 1 Lander",
    meta: "Chryse Planitia · 1976",
    hue: 10,
    planet: "mars",
    image: vikingImg,
    y: 0,
    rot: -3,
  },
  {
    id: "kepler",
    group: "Mars",
    title: "Kepler",
    meta: "Space telescope · 2009",
    hue: 25,
    planet: "mars",
    y: 190,
    rot: 2,
  },
  {
    id: "pioneer-10",
    group: "Mars",
    title: "Pioneer 10",
    meta: "Deep space probe · 1972",
    hue: 0,
    planet: "mars",
    y: -10,
    rot: 3,
  },
  // ---- Moon ----
  {
    id: "lrv",
    group: "Moon",
    title: "Lunar Roving Vehicles (LRVs)",
    meta: "Apollo 15 · 16 · 17",
    hue: 215,
    planet: "moon",
    y: 170,
    rot: -2,
  },
];

const TICKS = ["10", "20", "30", "40"]; // distance markers on the baseline

/* ---------- Pure-CSS artwork so the component works with no assets ---------- */
function Art({ planet, hue }) {
  const base = {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(120% 90% at 20% 10%, hsl(${hue} 70% 30% / .9), transparent 60%),
                 radial-gradient(90% 70% at 90% 100%, hsl(${hue + 50} 80% 25% / .8), transparent 65%),
                 #0a0818`,
  };
  const body = {
    position: "absolute",
    left: "50%",
    top: "52%",
    width: "70%",
    aspectRatio: "1",
    transform: "translate(-50%,-50%)",
    borderRadius: "50%",
  };
  const looks = {
    earth: {
      background: `radial-gradient(circle at 30% 30%, #8fd0ff, #1b5fb4 45%, #08203f 80%)`,
      boxShadow: "0 0 60px #4aa8ff88",
    },
    nebula: {
      background: `radial-gradient(circle at 50% 50%, #e7b3ff, #8a3ffc55 40%, transparent 70%)`,
      filter: "blur(6px)",
    },
    moon: {
      background: `radial-gradient(circle at 35% 30%, #f1f1ee, #9a9aa3 55%, #3a3a46 100%)`,
      boxShadow: "0 0 50px #ffffff33",
    },
    mars: {
      background: `radial-gradient(circle at 35% 30%, #ffb38a, #c1440e 55%, #3b1305 100%)`,
      boxShadow: "0 0 60px #ff6a3d66",
    },
    star: {
      background: `radial-gradient(circle at 40% 35%, #ffd2a0, #ff5a2e 50%, #4a0d08 90%)`,
      boxShadow: "0 0 90px #ff5a2eaa",
    },
    ring: {
      background: `radial-gradient(circle at 35% 30%, #ffe3a8, #c48a3a 55%, #3a2410 100%)`,
      width: "52%",
    },
    galaxy: {
      background: `conic-gradient(from 0deg, #0000, #b8a1ff88, #0000, #6fc0ff88, #0000)`,
      filter: "blur(3px)",
    },
  }[planet];
  return (
    <div style={base}>
      <div style={{ ...body, ...looks }} />
      {planet === "ring" && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "52%",
            width: "92%",
            height: "22%",
            transform: "translate(-50%,-50%) rotate(-18deg)",
            borderRadius: "50%",
            border: "5px solid #f2d79a99",
            boxShadow: "0 0 18px #f2d79a55",
          }}
        />
      )}
    </div>
  );
}

export default function Slide() {
  const done = useQuizProgress(); // { "viking-1": true, ... }
  const root = useRef(null);
  const track = useRef(null);
  const ghost = useRef(null);
  const bar = useRef(null);
  const astro = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const getDistance = () => track.current.scrollWidth - window.innerWidth;

      // الرائد بيميل شوية حسب سرعة السكرول، وبيرجع يتعدل لما السكرول يقف
      const tilt = gsap.quickTo(astro.current, "rotation", {
        duration: 0.9,
        ease: "power3.out",
      });
      const resetTilt = () => tilt(0);
      ScrollTrigger.addEventListener("scrollEnd", resetTilt);

      // 1) Pin the section and scrub the track sideways
      const scroll = gsap.to(track.current, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + getDistance(),
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) =>
            tilt(gsap.utils.clamp(-14, 14, self.getVelocity() / -300)),
        },
      });

      // 1b) Astronaut travels from the first card to the last card.
      //     Start: centred on the first card's left edge.
      //     End:   centred on the last card's right edge (when the scroll ends).
      //     He moves slower than the track, so the cards slide past him.
      const cards = gsap.utils.toArray(".sl-card", root.current);
      const first = cards[0];
      const last = cards[cards.length - 1];
      const half = () => astro.current.offsetWidth / 2;

      gsap.fromTo(
        astro.current,
        { x: () => first.offsetLeft - half() },
        {
          x: () => last.offsetLeft + last.offsetWidth - getDistance() - half(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + getDistance(),
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        },
      );

      // bobs up/down while you scroll, like swimming
      gsap.to(astro.current, {
        keyframes: { y: [0, -80, 40, -60, 30], easeEach: "sine.inOut" },
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + getDistance(),
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      // 2) Ghost heading drifts slower than the cards (parallax)
      gsap.to(ghost.current, {
        x: () => -getDistance() * 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + getDistance(),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // 3) Progress bar
      if (bar.current) {
        gsap.to(bar.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + getDistance(),
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }

      // 4) Each card straightens up + brightens as it crosses the viewport centre
      gsap.utils.toArray(".sl-card").forEach((card) => {
        const rot = Number(card.dataset.rot);
        gsap.fromTo(
          card,
          { rotation: rot * 2.5, scale: 0.88, opacity: 0.45 },
          {
            rotation: 0,
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scroll,
              start: "left 85%",
              end: "left 40%",
              scrub: true,
            },
          },
        );
      });

      return () => ScrollTrigger.removeEventListener("scrollEnd", resetTilt);
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="sl-root" aria-label="Space moments">
      <style>{css}</style>

      <h2 ref={ghost} className="sl-ghost" aria-hidden="true">
        SPACE MOMENTS
      </h2>

      {/* Floating astronaut (background layer, behind the cards) */}
      <div ref={astro} className="sl-astro" aria-hidden="true">
        <div className="sl-astro-mouse">
          <img
            className="sl-astro-img"
            src={astronautImg}
            alt=""
            draggable="false"
          />
        </div>
      </div>

      <div ref={track} className="sl-track">
        {SLIDES.map((s, i) => {
          const card = (
            <>
              <div className="sl-frame">
                <div className="sl-art">
                  {s.image ? (
                    <img src={s.image} alt={s.title} />
                  ) : (
                    <Art planet={s.planet} hue={s.hue} />
                  )}
                </div>
              </div>
              <h3>
                <span className="sl-group">{s.group} :</span> {s.title}
              </h3>
              <p>{s.meta}</p>
            </>
          );

          const isDone = !!done[s.id];

          return (
            <article
              key={s.title}
              className={`sl-card sl-${s.group.toLowerCase()}${isDone ? " sl-done" : ""}`}
              data-rot={s.rot}
              aria-disabled={isDone || undefined}
              style={{
                "--y": `${s.y}px`,
                "--h": s.hue,
                transform: `rotate(${s.rot}deg)`,
              }}
            >
              {i === 0 && !isDone ? ( // solved card = no link, can't be opened again
                <Link className="sl-card-link" to="/mars1">
                  {card}
                </Link>
              ) : (
                card
              )}
              {/* Star: outline = quiz not solved yet, filled = solved */}
              <span
                className={`sl-star${isDone ? " on" : ""}`}
                role="img"
                aria-label={
                  isDone ? "Quiz completed" : "Quiz not completed yet"
                }
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9z" />
                </svg>
              </span>
            </article>
          );
        })}
        <div className="sl-end" />
      </div>

      {/* Distance ruler along the bottom */}
      <div className="sl-ruler" aria-hidden="true">
        <div className="sl-ruler-ticks" />
      </div>
      <div className="sl-marks" aria-hidden="true">
        {TICKS.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      {/* Testing only: delete this button before you hand in the project */}
      <button type="button" className="sl-reset" onClick={resetQuizProgress}>
        Reset quiz
      </button>
    </section>
  );
}

/* ---------- Styles (scoped by sl- prefix) ---------- */
const css = `
.sl-root{
  --top:18vh; --yk:1;
  position:relative; height:100vh; height:100svh; overflow:hidden;
  background:
    radial-gradient(60% 50% at 15% 30%, #3a2a7a55, transparent 70%),
    radial-gradient(50% 50% at 85% 70%, #1f3a8a44, transparent 70%),
    #07051a;
  color:#fff; font-family:"Roboto Mono","JetBrains Mono",ui-monospace,monospace;
}
/* tiny star field */
.sl-root::before{
  content:""; position:absolute; inset:0; pointer-events:none; opacity:.7;
  background-image:
    radial-gradient(1.5px 1.5px at 12% 20%, #fff, transparent),
    radial-gradient(1px 1px at 33% 70%, #cfd8ff, transparent),
    radial-gradient(1.5px 1.5px at 58% 35%, #fff, transparent),
    radial-gradient(1px 1px at 79% 15%, #e6d7ff, transparent),
    radial-gradient(1px 1px at 91% 82%, #fff, transparent),
    radial-gradient(1px 1px at 45% 90%, #cfd8ff, transparent);
  background-size:420px 420px;
}
.sl-ghost{
  position:absolute; top:4vh; left:8vw; margin:0; white-space:nowrap;
  font-size:clamp(90px,17vw,260px); line-height:1; font-weight:800; letter-spacing:-.02em;
  color:transparent; background:linear-gradient(180deg,#8f7bff55 0%, #6a4bd01f 60%, transparent 100%);
  -webkit-background-clip:text; background-clip:text; user-select:none; pointer-events:none;
}
/* ---- floating astronaut ---- */
.sl-astro{
  position:absolute; top:24vh; left:0; z-index:0; /* z-index:2 = قدّام الكروت */
  width:clamp(110px,min(18vw,32vh),300px); pointer-events:none; will-change:transform;
}
/* soft glow behind him so he blends into the nebula */
.sl-astro::before{
  content:""; position:absolute; inset:-25%; z-index:-1; border-radius:50%;
  background:radial-gradient(closest-side, #8f7bff40, #4a6dff1a 55%, transparent 75%);
  filter:blur(10px);
}
/* mouse parallax, same --mx/--my variables the hero uses */
.sl-astro-mouse{
  translate:calc(var(--mx) * -22px) calc(var(--my) * -22px);
  transition:translate .4s ease-out;
}
/* zero-gravity drift: slow wander + tumble */
.sl-astro-img{
  display:block; width:100%; height:auto;
  transform-origin:50% 45%;
  animation:sl-astro-float 16s ease-in-out infinite;
  filter:drop-shadow(0 0 22px #8f7bff66) drop-shadow(0 24px 30px #000a);
}
@keyframes sl-astro-float{
  0%   { transform:translate(0,0) rotate(-8deg) scale(1); }
  25%  { transform:translate(22px,-30px) rotate(5deg) scale(1.03); }
  50%  { transform:translate(-16px,-52px) rotate(12deg) scale(1.05); }
  75%  { transform:translate(-26px,-16px) rotate(-3deg) scale(1.02); }
  100% { transform:translate(0,0) rotate(-8deg) scale(1); }
}
.sl-track{
  position:absolute; inset:0; display:flex; align-items:flex-start; gap:clamp(60px,12vw,200px);
  padding:0 14vw; width:max-content; will-change:transform; z-index:1;
}
.sl-card{
  position:relative; flex:none; width:clamp(150px,min(20vw,34vh),290px); margin-top:calc(var(--top) + var(--y) * var(--yk));
  text-align:center; will-change:transform; 
}
.sl-card-link{display:block; color:inherit; text-decoration:none}
/* ---- quiz star (top-right corner of each card) ---- */
.sl-star{
  position:absolute; top:-18px; right:-18px; z-index:3; width:46px; height:46px;
  display:grid; place-items:center; border-radius:50%;
  background:#0a0818d9; border:1.5px solid #ffffff2e; backdrop-filter:blur(4px);
  pointer-events:none;
}
.sl-star svg{width:26px; height:26px; fill:transparent; stroke:#ffffff80; stroke-width:1.6; stroke-linejoin:round; transition:fill .5s, stroke .5s, filter .5s}
.sl-star.on{border-color:#ffc94d99; box-shadow:0 0 22px #ffc94d66; animation:sl-star-pop .7s cubic-bezier(.2,1.6,.4,1) both}
.sl-star.on svg{fill:#ffc94d; stroke:#ffe29a; filter:drop-shadow(0 0 6px #ffc94dcc)}
@keyframes sl-star-pop{0%{transform:scale(.4) rotate(-40deg)} 100%{transform:scale(1) rotate(0)}}
/* solved card -> grayscale (the star stays golden: it is outside .sl-frame) */
.sl-frame{transition:filter .6s ease}
.sl-card.sl-done .sl-frame{filter:grayscale(1) brightness(.85)}
.sl-card.sl-done, .sl-card.sl-done *{cursor:not-allowed}
.sl-card.sl-done{user-select:none}
.sl-card.sl-done .sl-star{pointer-events:auto}
.sl-card.sl-done .sl-group{color:#8b8a99}
.sl-card.sl-done h3, .sl-card.sl-done p{opacity:.7}
.sl-frame{
  padding:5px; border-radius:14px; aspect-ratio:3/4;
  background:linear-gradient(135deg, #e9e4ff, #8f7bff 35%, #4a6dff 65%, #d9f1ff);
  box-shadow:0 0 40px hsl(var(--h) 90% 60% / .35), 0 25px 60px #000a;
}
/* Mars cards: frame in Mars colours */
.sl-mars .sl-frame{
  background:linear-gradient(135deg, #ffd9bd, #e8693a 35%, #b5340f 65%, #ffb48a);
  box-shadow:0 0 40px #ff6a3d59, 0 25px 60px #000a;
}
.sl-mars .sl-group{color:#ff8a5c}
.sl-art{position:relative; width:100%; height:100%; border-radius:10px; overflow:hidden; background:#0a0818}
.sl-art img{width:100%; height:100%; object-fit:cover; display:block}
.sl-card h3{margin:22px 0 8px; font:700 14px/1.3 "Times New Roman",Georgia,serif; letter-spacing:.14em; text-transform:uppercase}
.sl-group{display:block; margin-bottom:6px; color:#8f7bff; letter-spacing:.2em}
.sl-card p{margin:0; font-size:11px; letter-spacing:.12em; color:#a9a4c8}
.sl-end{flex:none; width:10vw}
.sl-reset{position:absolute; left:16px; bottom:44px; z-index:5; cursor:pointer; padding:8px 14px; border-radius:999px;
  border:1px solid #ffffff40; background:#0a0818cc; color:#fff; font:500 12px "Roboto Mono",monospace}
.sl-reset:hover{background:#ffffff22}
.sl-ruler{position:absolute; left:0; right:0; bottom:0; height:30px}
.sl-ruler-ticks{
  position:absolute; inset:0;
  background:repeating-linear-gradient(90deg, #ffffff30 0 1px, transparent 1px 22px);
  mask:linear-gradient(0deg,#000 0 14px,transparent 14px);
  -webkit-mask:linear-gradient(0deg,#000 0 14px,transparent 14px);
}
.sl-progress{position:absolute; left:0; bottom:0; width:100%; height:3px; background:linear-gradient(90deg,#8f7bff,#6fc0ff); transform:scaleX(0); transform-origin:left}
.sl-marks{position:absolute; left:0; right:0; bottom:46px; display:flex; justify-content:space-around; font-size:clamp(40px,6vw,76px); font-weight:700; color:#ffffff0f; pointer-events:none}
@media (max-width:640px){
  .sl-card{width:min(62vw,36vh)} .sl-track{gap:14vw}
  .sl-astro{width:clamp(100px,34vw,170px)}
}
/* شاشات قصيرة (موبايل landscape / لابتوب صغير): قلل الإزاحة الرأسية عشان الكروت ماتتقصش */
@media (max-height:700px){ .sl-root{--yk:.7} }
@media (max-height:520px){ .sl-root{--top:8vh; --yk:.4} .sl-ghost{top:2vh} .sl-marks{display:none} }
@media (prefers-reduced-motion: reduce){
  .sl-root{height:auto; overflow-x:auto}
  .sl-track{position:relative; padding-bottom:80px}
  .sl-astro{left:6vw}
}
`;
