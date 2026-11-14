// Reusable quiz. Drop it at the bottom of any card page:
//   <Quiz cardId="viking-1" questions={[{ q, options: [...], answer: 0 }]} />
// When every answer is right it marks the card as done and sends the
// user back to the slider, where the card's star is filled.
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { markQuizDone, useQuizProgress } from "../../utils/quizProgress";
import { useParallax } from "../../hooks/useParallax";
import kidImg from "../../../assets/img/space-research.png";

const css = `
.qz{--ok:#3E7A47;--bad:#9C2F2F;--on-accent:#FBEFE2}
@media (prefers-color-scheme:dark){.qz{--ok:#8FD19A;--bad:#FF9C8F;--on-accent:#2A1408}}
.qz-body{position:relative;margin-top:48px}
.qz-list{list-style:none;margin:0;padding:0;display:grid;gap:20px}
.qz-kid{position:absolute;right:0;top:0;width:220px;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2;
  transition:top .9s cubic-bezier(.34,1.25,.5,1),height .9s cubic-bezier(.34,1.25,.5,1)}
.qz-kid img{display:block;width:100%;max-height:100%;object-fit:contain;
  translate:calc(var(--mx,0)*-34px) calc(var(--my,0)*-34px);transition:translate .4s ease-out}
@media(prefers-reduced-motion:no-preference){.qz-kid img{animation:qzfloat 7s ease-in-out infinite}}
@keyframes qzfloat{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-22px) rotate(2deg)}}
@media(min-width:1025px){.qz-body{padding-right:240px}}
@media(max-width:1024px){.qz-kid{display:none}}
.qz-q{padding:28px;border-radius:20px;background:var(--surface,#fff);border:1px solid var(--line,#D9CCC4)}
.qz-q h3{display:flex;gap:14px;align-items:baseline}
.qz-n{font:800 1.7rem var(--display,inherit);color:var(--accent,#A8432A);line-height:1}
.qz-opts{display:grid;gap:10px;margin-top:20px}
.qz-opt{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:14px;
  border:1.5px solid var(--line,#D9CCC4);background:var(--bg,#EFE8E4);transition:border-color .2s,background .2s,opacity .2s}
.qz-opt:hover{border-color:var(--accent,#A8432A)}
.qz-dot{flex:none;width:20px;height:20px;border-radius:50%;border:2px solid var(--line,#D9CCC4);display:grid;place-items:center;
  font:800 .75rem/1 var(--display,inherit);color:var(--on-accent);transition:.2s}
.qz-opt.sel{border-color:var(--accent,#A8432A);background:color-mix(in srgb,var(--accent,#A8432A) 12%,var(--bg,#EFE8E4))}
.qz-opt.sel .qz-dot{background:var(--accent,#A8432A);border-color:var(--accent,#A8432A)}
.qz-opt.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 14%,var(--bg,#EFE8E4))}
.qz-opt.ok .qz-dot{background:var(--ok);border-color:var(--ok)}
.qz-opt.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,var(--bg,#EFE8E4))}
.qz-opt.bad .qz-dot{background:var(--bad);border-color:var(--bad)}
.qz-opt.dim{opacity:.55;cursor:default}
.qz-opt.dim:hover{border-color:var(--line,#D9CCC4)}
.qz-foot{display:flex;flex-wrap:wrap;align-items:center;gap:20px;margin-top:32px}
.qz-btn{all:unset;box-sizing:border-box;cursor:pointer;background:var(--accent,#A8432A);color:var(--on-accent);font-weight:500;padding:14px 28px;border-radius:999px;transition:opacity .2s,transform .2s}
.qz-btn:hover:not(:disabled){transform:translateY(-1px)}
.qz-btn:disabled{opacity:.4;cursor:not-allowed}
.qz-btn.ghost{background:transparent;color:var(--text,#2A201C);border:1.5px solid var(--line,#D9CCC4)}
.qz-status{font-weight:500;color:var(--muted,#6E5F58)}
.qz-status.good{color:var(--ok)}
.qz-status.warn{color:var(--bad)}
.qz-done{display:inline-block;margin-top:20px;padding:6px 14px;border-radius:999px;border:1px solid var(--ok);color:var(--ok);font-size:.85rem;font-weight:500}
.qz-start{margin-top:40px;display:flex;flex-direction:column;align-items:center;gap:16px}
.qz-hint{margin:0;text-align:center;font-weight:500;color:var(--muted,#6E5F58)}
.qz-hint span{display:inline-block}
@media(prefers-reduced-motion:no-preference){
.qz-btn.big{animation:qzpulse 2s infinite}
.qz-hint span{animation:qzpoint 1s ease-in-out infinite}}
@keyframes qzpulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent,#A8432A) 55%,transparent)}70%{box-shadow:0 0 0 16px transparent}100%{box-shadow:0 0 0 0 transparent}}
@keyframes qzpoint{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.qz-btn.big{display:inline-flex;align-items:center;gap:12px;font-size:1.1rem;padding:18px 36px}
.qz-btn.big span{transition:transform .2s}
.qz-btn.big:hover span{transform:translate(4px,-4px) rotate(8deg)}
@media(prefers-reduced-motion:no-preference){.qz-list{animation:qzin .45s ease both}}
@keyframes qzin{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@media(max-width:600px){.qz-q{padding:22px 18px}}
`;

export default function Quiz({
  cardId,
  title = "Test your knowledge",
  intro = "Answer all three questions about the mission. Get them right and you earn this card’s star.",
  questions,
  redirectDelay = 1600,
}) {
  const navigate = useNavigate();
  const progress = useQuizProgress();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false); // quiz stays hidden until the user is ready
  const timer = useRef(null);

  // the kid stands next to the "active" question and follows it down the page
  useParallax(); // same mouse effect as the hero
  const [active, setActive] = useState(0);
  const itemRefs = useRef([]);
  const kidRef = useRef(null);
  const bodyRef = useRef(null);
  const nextTimer = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      clearTimeout(nextTimer.current);
    },
    [],
  );

  // put the kid beside the active question (same top + height as its card)
  const placeKid = useCallback(() => {
    const card = itemRefs.current[active];
    const kidEl = kidRef.current;
    if (!card || !kidEl) return;
    kidEl.style.top = `${card.offsetTop}px`;
    kidEl.style.height = `${card.offsetHeight}px`;
  }, [active]);

  useLayoutEffect(() => {
    placeKid();
  }, [placeKid, started, submitted]);

  // keep it aligned when the layout changes (resize, fonts, wrapping...)
  useEffect(() => {
    if (!started || !bodyRef.current) return;
    const ro = new ResizeObserver(placeKid);
    ro.observe(bodyRef.current);
    return () => ro.disconnect();
  }, [started, placeKid]);

  // whichever question is at the middle of the screen becomes the active one
  useEffect(() => {
    if (!started) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [started]);

  const total = questions.length;
  const answered = Object.keys(answers).length;
  const score = questions.filter((q, i) => answers[i] === q.answer).length;
  const perfect = submitted && score === total;

  function choose(qi, oi) {
    if (submitted) return;
    const firstAnswer = answers[qi] === undefined;
    setAnswers((a) => ({ ...a, [qi]: oi }));

    // first answer to this question: the kid goes down to the next one
    if (firstAnswer && qi < total - 1 && answers[qi + 1] === undefined) {
      clearTimeout(nextTimer.current);
      nextTimer.current = setTimeout(() => {
        setActive(qi + 1);
        itemRefs.current[qi + 1]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
    }
  }

  function submit() {
    setSubmitted(true);
    if (score === total) {
      markQuizDone(cardId);
      // short pause so the green answers are seen, then back to the slider
      timer.current = setTimeout(
        () => navigate("/", { state: { scrollTo: "slider" } }),
        redirectDelay,
      );
    }
  }

  function retry() {
    setAnswers({});
    setSubmitted(false);
    setActive(0);
    itemRefs.current[0]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <section id="quiz" className="qz">
      <style>{css}</style>
      <div className="wrap">
        <p
          className="part"
          style={{
            color: "var(--accent)",
            fontWeight: 500,
            fontSize: ".9rem",
            marginBottom: 8,
          }}
        >
          Quiz
        </p>
        <h2>{title}</h2>
        <p className="lede">{intro}</p>
        {progress[cardId] && !submitted && (
          <span className="qz-done">✓ Completed — your star is lit</span>
        )}

        {!started && (
          <div className="qz-start">
            <button
              type="button"
              className="qz-btn big"
              onClick={() => setStarted(true)}
            >
              Ready to get the star? <span aria-hidden="true">⭐</span>
            </button>
            <p className="qz-hint">
              <span aria-hidden="true">👆</span> Click the button to start the
              quiz!
            </p>
          </div>
        )}

        {started && (
          <>
            <div className="qz-body" ref={bodyRef}>
              <ol className="qz-list">
                {questions.map((item, qi) => (
                  <li
                    key={item.q}
                    className="qz-q"
                    data-index={qi}
                    ref={(el) => {
                      itemRefs.current[qi] = el;
                    }}
                  >
                    <h3 id={`qz-q-${qi}`}>
                      <span className="qz-n">{qi + 1}</span>
                      {item.q}
                    </h3>
                    <div
                      className="qz-opts"
                      role="radiogroup"
                      aria-labelledby={`qz-q-${qi}`}
                    >
                      {item.options.map((opt, oi) => {
                        const picked = answers[qi] === oi;
                        const isRight = oi === item.answer;
                        let cls = "qz-opt";
                        let mark = "";
                        if (!submitted) {
                          if (picked) cls += " sel";
                        } else if (isRight) {
                          cls += " ok";
                          mark = "✓";
                        } else if (picked) {
                          cls += " bad";
                          mark = "✕";
                        } else {
                          cls += " dim";
                        }
                        return (
                          <button
                            key={opt}
                            type="button"
                            role="radio"
                            aria-checked={picked}
                            className={cls}
                            onClick={() => choose(qi, oi)}
                          >
                            <span className="qz-dot" aria-hidden="true">
                              {mark}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="qz-kid" ref={kidRef} aria-hidden="true">
                <img src={kidImg} alt="" />
              </div>
            </div>

            <div className="qz-foot" aria-live="polite">
              {!submitted && (
                <>
                  <button
                    type="button"
                    className="qz-btn"
                    disabled={answered < total}
                    onClick={submit}
                  >
                    Submit answers
                  </button>
                  <span className="qz-status">
                    {answered} of {total} answered
                  </span>
                </>
              )}
              {perfect && (
                <span className="qz-status good">
                  {score} / {total} — Mission accomplished! Taking you back to
                  the cards…
                </span>
              )}
              {submitted && !perfect && (
                <>
                  <button
                    type="button"
                    className="qz-btn ghost"
                    onClick={retry}
                  >
                    Try again
                  </button>
                  <span className="qz-status warn">
                    You got {score} of {total}. Check the marked answers and try
                    again.
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
