import HeroBanner from "./components/HeroBanner";
import RowContainer from "../../components/movie/RowContainer";

const Home = () => {
  return (
    <div className="text-white bg-[#161616]">
      <HeroBanner />
      <div className="relative z-10 bg-[#161616] pb-24 md:pb-12">
        <RowContainer />
      </div>
    </div>
  );
};


export default Home;
