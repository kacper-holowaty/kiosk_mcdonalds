import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import AdminPanel from "./AdminPanel";
import axios from "axios";
import EditForm from "./EditForm";

function AdminMain() {
  const { state, dispatch } = useAppContext();
  const { isAdmin, products } = state;
  const [product, setProduct] = useState(null);

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      const response = await axios.get("http://localhost:5000/products");
      dispatch({ type: "SET_PRODUCTS", payload: response.data });
    } catch (error) {
      console.error("Błąd podczas usuwania produktu:", error);
    }
  };

  const onCancel = () => {
    setProduct(null);
  };

  return (
    <div>
      {isAdmin && <AdminPanel />}
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - {product.type} - {product.price}
            <button onClick={() => setProduct(product)}>Edytuj</button>
            <button onClick={() => handleDeleteProduct(product._id)}>
              Usuń
            </button>
          </li>
        ))}
      </ul>
      {product && <EditForm editedProduct={product} stopEditting={onCancel} />}
    </div>
  );
}

export default AdminMain;
