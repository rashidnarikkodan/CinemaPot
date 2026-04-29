import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

import LandingPage from "../pages/Land/LandPage";
import Browse from "../pages/Browse/Browse";
import Home from "../pages/Home/Home";
import Movie from "../pages/Movie/Movie";
import Series from "../pages/Series/Series";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/browse/:id" element={<Movie />} />
          <Route path="/watch/movie/:id" element={<Movie />} />
          <Route path="/watch/tv/:id" element={<Series />} />
        </Routes>
      </BrowserRouter>


      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;