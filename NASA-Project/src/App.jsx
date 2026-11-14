import { useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Mars1 from "./pages/Mars1";
import Pioneer from "./pages/Pioneer";
import Moon from "./pages/Moon";
import Kepler from "./pages/Kepler";
import PageNotFound from "./pages/PageNotFound";

// Every new page starts from the top (React Router keeps the old scroll position)
function ScrollToTop() {
  const { pathname, state } = useLocation();

  useLayoutEffect(() => {
    // coming back from a quiz: HomePage scrolls to the slider by itself
    if (state?.scrollTo) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, state]);

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
        <Route path="/moon" element={<Moon />} />
        <Route path="/kepler" element={<Kepler />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
