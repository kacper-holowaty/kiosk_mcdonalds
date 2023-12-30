import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
// import MenuItem from "./MenuItem";
import axios from "axios";
import CategoryList from "./CategoryList";
function Menu() {
  // const { state, dispatch } = useAppContext();
  // const { products } = state;

  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setTypes(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii z backendu:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Wybierz, na co masz dziś ochotę...</h1>
      {/* <ul>
        {products.map((item) => (
          <MenuItem key={item._id} item={item} />
        ))}
      </ul> */}
      <ul>
        {types.map((type) => (
          <li key={type}>
            {/* <Link to={`/start/menu/${type}`}>{type}</Link> */}
            <CategoryList type={type} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
