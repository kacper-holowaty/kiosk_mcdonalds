import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItem from "./MenuItem";
function CategoryList({ type }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/products/${type}`
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
      <ul>
        {products.map((item) => (
          <MenuItem key={item._id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
