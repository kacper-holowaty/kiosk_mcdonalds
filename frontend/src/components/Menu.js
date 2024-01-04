import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import CategoryList from "./CategoryList";
import { FaArrowRight } from "react-icons/fa";

function Menu() {
  const { state } = useAppContext();
  const { basket } = state;
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const firstTypeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {}, [basket]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setTypes(response.data);
        firstTypeRef.current && firstTypeRef.current.focus();
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii z backendu:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (firstTypeRef.current) {
      const firstType = firstTypeRef.current.querySelector("li");
      firstType && firstType.focus();
      setSelectedType(firstType ? firstType.innerText : null);
    }
  }, [types]);

  const handleClick = (type) => {
    setSelectedType(type);
  };
  return (
    <div>
      {/* <button onClick={() => navigate("/start")}>Powrót</button> */}

      <button
        onClick={() => navigate("/start")}
        className="fixed top-4 right-4 bg-red-500 hover:bg-red-700 px-6 py-3 text-white rounded-lg text-xl"
      >
        Powrót
      </button>

      <h1 className="text-center text-3xl mb-3 mt-3">
        Wybierz, na co masz dziś ochotę...
      </h1>
      <div className="flex">
        <ul ref={firstTypeRef} className="w-1/4">
          {types.map((type) => (
            <li
              key={type}
              onClick={() => handleClick(type)}
              tabIndex={0}
              // uppercase w className psuje Refa (jak?)
              className="p-6 bg-red-500 rounded-3xl mb-1 mt-1 ml-4 text-white flex justify-between items-center cursor-pointer hover:bg-red-700"
            >
              <div className="text-2xl tracking-wide">{type}</div>{" "}
              <div>
                <FaArrowRight />
              </div>
            </li>
          ))}
        </ul>
        {selectedType && <CategoryList type={selectedType} />}
      </div>
      {basket.length > 0 && (
        <button onClick={() => navigate("/start/menu/basket")}>
          Przejdź do koszyka
        </button>
      )}
    </div>
  );
}

export default Menu;
