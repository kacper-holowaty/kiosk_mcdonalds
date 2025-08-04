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
    <div className="p-4">
      <h3 className="uppercase font-extrabold text-4xl mb-6 text-gray-800 tracking-wide">
        {type}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((item) => (
          <MenuItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
