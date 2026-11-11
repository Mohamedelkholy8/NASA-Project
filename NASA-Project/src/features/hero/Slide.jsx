// Slides.jsx
// npm i gsap
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Content: edit freely. Add `image: "/your.jpg"` to use a photo ---------- */
const SLIDES = [
  { title: "Blue Horizon", meta: "Earth orbit · 400 km", hue: 205, planet: "earth", y: 0, rot: -3 },
  { title: "Violet Nebula", meta: "Orion arm · 1,300 ly", hue: 275, planet: "nebula", y: 190, rot: 2 },
  { title: "The Lunar Dunk", meta: "Sea of Tranquility · 1 shot", hue: 20, planet: "moon", y: -10, rot: 3 },
  { title: "Red Giant", meta: "Betelgeuse · 700 ly", hue: 8, planet: "star", y: 170, rot: -2 },
  { title: "Ringed World", meta: "Saturn · 9.5 AU", hue: 40, planet: "ring", y: 10, rot: 3 },
  { title: "Deep Field", meta: "13 billion years back", hue: 250, planet: "galaxy", y: 180, rot: -3 },
];

const TICKS = ["10", "20", "30", "40", "50", "60"]; // distance markers on the baseline

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
    earth: { background: `radial-gradient(circle at 30% 30%, #8fd0ff, #1b5fb4 45%, #08203f 80%)`, boxShadow: "0 0 60px #4aa8ff88" },
    nebula: { background: `radial-gradient(circle at 50% 50%, #e7b3ff, #8a3ffc55 40%, transparent 70%)`, filter: "blur(6px)" },
    moon: { background: `radial-gradient(circle at 35% 30%, #f1f1ee, #9a9aa3 55%, #3a3a46 100%)`, boxShadow: "0 0 50px #ffffff33" },
    star: { background: `radial-gradient(circle at 40% 35%, #ffd2a0, #ff5a2e 50%, #4a0d08 90%)`, boxShadow: "0 0 90px #ff5a2eaa" },
    ring: { background: `radial-gradient(circle at 35% 30%, #ffe3a8, #c48a3a 55%, #3a2410 100%)`, width: "52%" },
    galaxy: { background: `conic-gradient(from 0deg, #0000, #b8a1ff88, #0000, #6fc0ff88, #0000)`, filter: "blur(3px)" },
  }[planet];
  return (
    <div style={base}>
      <div style={{ ...body, ...looks }} />
      {planet === "ring" && (
        <div
          style={{
            position: "absolute", left: "50%", top: "52%", width: "92%", height: "22%",
            transform: "translate(-50%,-50%) rotate(-18deg)", borderRadius: "50%",
            border: "5px solid #f2d79a99", boxShadow: "0 0 18px #f2d79a55",
          }}
        />
      )}
    </div>
  );
}

export default function Slide() {
  const root = useRef(null);
  const track = useRef(null);
  const ghost = useRef(null);
  const bar = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const getDistance = () => track.current.scrollWidth - window.innerWidth;

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
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="sl-root" aria-label="Space moments">
      <style>{css}</style>

      <h2 ref={ghost} className="sl-ghost" aria-hidden="true">
        SPACE MOMENTS
      </h2>

      <div ref={track} className="sl-track">
        {SLIDES.map((s, i) => (
          <article
            key={s.title}
            className="sl-card"
            data-rot={s.rot}
            style={{ "--y": `${s.y}px`, "--h": s.hue, transform: `rotate(${s.rot}deg)` }}
          >
            <div className="sl-frame">
              <div className="sl-art">
                {s.image ? <img src={s.image} alt={s.title} /> : <Art planet={s.planet} hue={s.hue} />}
              </div>
            </div>
            <h3>{s.title}</h3>
            <p>{s.meta}</p>
          </article>
        ))}
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
    </section>
  );
}

/* ---------- Styles (scoped by sl- prefix) ---------- */
const css = `
.sl-root{
  position:relative; height:100vh; overflow:hidden;
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
.sl-track{
  position:absolute; inset:0; display:flex; align-items:flex-start; gap:clamp(60px,12vw,200px);
  padding:0 14vw; width:max-content; will-change:transform;
}
.sl-card{
  position:relative; flex:none; width:clamp(200px,20vw,290px); margin-top:calc(18vh + var(--y));
  text-align:center; will-change:transform; 
}
.sl-frame{
  padding:5px; border-radius:14px; aspect-ratio:3/4;
  background:linear-gradient(135deg, #e9e4ff, #8f7bff 35%, #4a6dff 65%, #d9f1ff);
  box-shadow:0 0 40px hsl(var(--h) 90% 60% / .35), 0 25px 60px #000a;
}
.sl-art{position:relative; width:100%; height:100%; border-radius:10px; overflow:hidden; background:#0a0818}
.sl-art img{width:100%; height:100%; object-fit:cover; display:block}
.sl-card h3{margin:22px 0 8px; font:700 14px/1.3 "Times New Roman",Georgia,serif; letter-spacing:.14em; text-transform:uppercase}
.sl-card p{margin:0; font-size:11px; letter-spacing:.12em; color:#a9a4c8}
.sl-end{flex:none; width:10vw}
.sl-ruler{position:absolute; left:0; right:0; bottom:0; height:30px}
.sl-ruler-ticks{
  position:absolute; inset:0;
  background:repeating-linear-gradient(90deg, #ffffff30 0 1px, transparent 1px 22px);
  mask:linear-gradient(0deg,#000 0 14px,transparent 14px);
  -webkit-mask:linear-gradient(0deg,#000 0 14px,transparent 14px);
}
.sl-progress{position:absolute; left:0; bottom:0; width:100%; height:3px; background:linear-gradient(90deg,#8f7bff,#6fc0ff); transform:scaleX(0); transform-origin:left}
.sl-marks{position:absolute; left:0; right:0; bottom:46px; display:flex; justify-content:space-around; font-size:clamp(40px,6vw,76px); font-weight:700; color:#ffffff0f; pointer-events:none}
@media (max-width:640px){ .sl-card{width:62vw} .sl-track{gap:14vw} }
@media (prefers-reduced-motion: reduce){
  .sl-root{height:auto; overflow-x:auto}
  .sl-track{position:relative; padding-bottom:80px}
}
`;
