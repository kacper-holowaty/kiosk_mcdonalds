import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItem from "./MenuItem";

const backendUrl = process.env.REACT_APP_BACKEND_URL

function CategoryList({ type }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/products/${type}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii z backendu:", error);
      }
    };
    fetchProducts();
  }, [type]);

  return (
    <div>
      <h3 className="uppercase ml-32 font-bold text-2xl">{type}:</h3>
      <ul>
        {products.map((item) => (
          <MenuItem key={item._id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
