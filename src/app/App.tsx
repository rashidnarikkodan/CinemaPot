import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import Loader from "../components/common/Loader";

import GlobalBravePopup from "../components/common/GlobalBravePopup";
import MobileBottomNav from "../components/common/MobileBottomNav";

// Lazy load pages for bundle optimization
const Browse = lazy(() => import("../pages/Browse/Browse"));
const Movie = lazy(() => import("../pages/Movie/Movie"));
const Series = lazy(() => import("../pages/Series/Series"));
const Home = lazy(() => import("../pages/Home/Home"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/browse/:id" element={<Movie />} />
            <Route path="/watch/movie/:id" element={<Movie />} />
            <Route path="/watch/tv/:id" element={<Series />} />
          </Routes>
        </Suspense>
        <MobileBottomNav />
      </BrowserRouter>

      <GlobalBravePopup />
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;