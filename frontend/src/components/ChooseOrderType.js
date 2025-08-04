import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { FaHamburger } from "react-icons/fa";
import { GiPaperBagFolded } from "react-icons/gi";

function ChooseOrderType() {
  const { dispatch } = useAppContext();
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <Link to="/">
        <button className="fixed top-4 right-4 bg-mcdonalds hover:bg-red-700 px-4 py-2 text-base md:px-6 md:py-3 md:text-xl text-white rounded-lg">
          Strona Główna
        </button>
      </Link>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-16 text-center">
        Wybierz rodzaj zamówienia
      </h2>
      <div className="flex flex-col md:flex-row md:space-x-8 w-full md:w-auto px-4 md:px-0 space-y-8 md:space-y-0">
        <Link
          to="menu"
          onClick={() => dispatch({ type: "EAT_IN" })}
          className="flex flex-col items-center justify-center w-full bg-mcdonalds text-white p-6 sm:p-8 md:p-12 lg:p-14 rounded-lg shadow-md"
        >
          <div className="mb-4 md:mb-8">
            <FaHamburger className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40" />
          </div>
          <div className="text-xl md:text-3xl">Na miejscu</div>
        </Link>
        <Link
          to="menu"
          onClick={() => dispatch({ type: "TAKEOUT" })}
          className="flex flex-col items-center justify-center w-full bg-mcdonalds text-white p-6 sm:p-8 md:p-12 lg:p-14 rounded-lg shadow-md"
        >
          <div className="mb-4 md:mb-8">
            <GiPaperBagFolded className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40" />
          </div>
          <div className="text-xl md:text-3xl">Na wynos</div>
        </Link>
      </div>
    </div>
  );
}

export default ChooseOrderType;
