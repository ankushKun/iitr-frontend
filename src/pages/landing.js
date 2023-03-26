import Navbar from "../components/navbar";
import art1 from "../assets/smiley.png";

export default function Landing() {
  return (
    <div className="w-100 bg-black h-[100%]">
      <Navbar redirect={true} />
      <div className="items-center justify-center h-[100vh] text-[#f94d1f]">
        <div className="text-6xl font-libre-franklin font-bold flex justify-around">
          <div className="leading-normal text-7xl pl-10">Say goodbye to<br />
            the traditional<br />
            ways of<br />
            identification
          </div>
          <div><img src={art1} width={450}></img></div>
        </div>
      </div>
    </div>
  );
}
