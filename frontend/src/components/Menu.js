import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import CategoryList from "./CategoryList";
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
      <button onClick={() => navigate("/start")}>Powrót</button>
      <h1>Wybierz, na co masz dziś ochotę...</h1>
      <ul ref={firstTypeRef}>
        {types.map((type) => (
          <li key={type} onClick={() => handleClick(type)} tabIndex={0}>
            {type}
          </li>
        ))}
      </ul>
      {selectedType && <CategoryList type={selectedType} />}
      {basket.length > 0 && (
        <button onClick={() => navigate("/start/menu/basket")}>
          Przejdź do koszyka
        </button>
      )}
    </div>
  );
}

export default Menu;
