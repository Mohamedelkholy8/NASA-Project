// Reusable quiz. Drop it at the bottom of any card page:
//   <Quiz cardId="viking-1" questions={[{ q, options: [...], answer: 0 }]} />
// When every answer is right it marks the card as done and sends the
// user back to the slider, where the card's star is filled.
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { markQuizDone, useQuizProgress } from "../../utils/quizProgress";

const css = `
.qz{--ok:#3E7A47;--bad:#9C2F2F;--on-accent:#FBEFE2}
@media (prefers-color-scheme:dark){.qz{--ok:#8FD19A;--bad:#FF9C8F;--on-accent:#2A1408}}
.qz-list{list-style:none;margin:48px 0 0;padding:0;display:grid;gap:20px}
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
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const total = questions.length;
  const answered = Object.keys(answers).length;
  const score = questions.filter((q, i) => answers[i] === q.answer).length;
  const perfect = submitted && score === total;

  function choose(qi, oi) {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qi]: oi }));
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

        <ol className="qz-list">
          {questions.map((item, qi) => (
            <li key={item.q} className="qz-q">
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
              {score} / {total} — Mission accomplished! Taking you back to the
              cards…
            </span>
          )}
          {submitted && !perfect && (
            <>
              <button type="button" className="qz-btn ghost" onClick={retry}>
                Try again
              </button>
              <span className="qz-status warn">
                You got {score} of {total}. Check the marked answers and try
                again.
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
