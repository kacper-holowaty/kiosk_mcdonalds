import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { FaHamburger } from "react-icons/fa";
import { GiPaperBagFolded } from "react-icons/gi";

function ChooseOrderType() {
  const { dispatch } = useAppContext();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/">
        <button className="fixed top-4 right-4 bg-mcdonalds hover:bg-red-700 px-6 py-3 text-white rounded-lg text-xl">
          Strona Główna
        </button>
      </Link>
      <h2 className="text-4xl font-bold mb-16">Wybierz rodzaj zamówienia</h2>
      <div className="flex space-x-8">
        <Link
          to="menu"
          onClick={() => dispatch({ type: "EAT_IN" })}
          className="flex flex-col items-center justify-center w-full bg-mcdonalds text-white p-14 rounded-lg shadow-md mb-4"
        >
          <div className="mb-8">
            <FaHamburger size={200} />
          </div>
          <div className="text-3xl">Na miejscu</div>
        </Link>
        <Link
          to="menu"
          onClick={() => dispatch({ type: "TAKEOUT" })}
          className="flex flex-col items-center justify-center w-full bg-mcdonalds text-white p-14 rounded-lg shadow-md mb-4"
        >
          <div className="mb-8">
            <GiPaperBagFolded size={200} />
          </div>
          <div className="text-3xl">Na wynos</div>
        </Link>
      </div>
    </div>
  );
}

export default ChooseOrderType;
