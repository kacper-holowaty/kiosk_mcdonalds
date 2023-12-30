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

  const goToBasket = () => {
    navigate("/start/menu/basket");
  };

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

  const handleClick = (type) => {
    setSelectedType(type);
  };
  return (
    <div>
      <h1>Wybierz, na co masz dziś ochotę...</h1>
      <ul>
        {types.map((type, id) => (
          <li
            key={type}
            onClick={() => handleClick(type)}
            ref={id === 0 ? firstTypeRef : null}
          >
            {type}
          </li>
        ))}
      </ul>
      {selectedType && <CategoryList type={selectedType} />}
      {basket.length > 0 && (
        <button onClick={goToBasket}>Przejdź do koszyka</button>
      )}
    </div>
  );
}

export default Menu;
