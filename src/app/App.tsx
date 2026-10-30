import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import Loader from "../components/common/Loader";

import AdBlockTip from "../components/common/AdBlockTip";
import MobileBottomNav from "../components/common/MobileBottomNav";

import Home from "../pages/Home/Home";
import Browse from "../pages/Browse/Browse";
import Movie from "../pages/Movie/Movie";
import Series from "../pages/Series/Series";

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
            <Route path="/watch/tv/:id/:season/:episode" element={<Series />} />
          </Routes>
        </Suspense>
        <MobileBottomNav />
      </BrowserRouter>

      <AdBlockTip />
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;