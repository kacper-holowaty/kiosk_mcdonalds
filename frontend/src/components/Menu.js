import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { useAppContext } from "../context/AppContext";
// import MenuItem from "./MenuItem";
import axios from "axios";
import CategoryList from "./CategoryList";
function Menu() {
  // const { state, dispatch } = useAppContext();
  // const { products } = state;

  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const firstTypeRef = useRef(null);

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
    </div>
  );
}

export default Menu;
