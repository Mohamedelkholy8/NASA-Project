import { useLayoutEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Mars1 from "./pages/Mars1";
import Pioneer from "./pages/Pioneer";
import Kepler from "./pages/Kepler";
import Moon from "./pages/Moon";
import PageNotFound from "./pages/PageNotFound";

// Every new page starts from the top (React Router keeps the old scroll position)
function ScrollToTop() {
  const { pathname, state } = useLocation();
  const stateRef = useRef(state);

  // keep the latest state in the ref (updated in an effect, not during render)
  useLayoutEffect(() => {
    stateRef.current = state;
  }, [state]);

  // runs ONLY when the page (pathname) changes, never when just the state
  // changes (HomePage clears its state after jumping to the slider)
  useLayoutEffect(() => {
    // coming back from a quiz: HomePage scrolls to the slider by itself
    if (stateRef.current?.scrollTo) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mars1" element={<Mars1 />} />
        <Route path="/pioneer" element={<Pioneer />} />
        <Route path="/kepler" element={<Kepler />} />
        <Route path="/moon" element={<Moon />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
