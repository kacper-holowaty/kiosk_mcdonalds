import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import EditProductInBasket from "./EditProductInBasket";
import axios from "axios";

function Basket() {
  const { state, dispatch } = useAppContext();
  const { basket } = state;
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const editProduct = (item) => {
    setProduct(item);
  };

  const removeProduct = (id) => {
    dispatch({ type: "REMOVE_FROM_BASKET", payload: { id } });
  };

  useEffect(() => {
    if (basket.length === 0) {
      setTimeout(() => {
        navigate("/start/menu");
      }, 1000);
    }
  }, [basket, navigate]);

  const clearBasket = () => {
    dispatch({ type: "CLEAR_BASKET" });
  };

  const handleSubmit = (editedProduct, index) => {
    dispatch({
      type: "UPDATE_BASKET",
      payload: { item: editedProduct, index },
    });
    setProduct(null);
  };

  const startPayment = async () => {
    try {
      const data = {
        order: basket,
      };

      // Wywołanie endpointu API, aby dodać zamówienie do bazy danych
      const response = await axios.post("http://localhost:5000/orders", data);
      const orderId = response.data.orderId;

      // Czyść koszyk po udanym zamówieniu
      // dispatch({ type: "CLEAR_BASKET" });

      // Przejście do ekranu płatności z przekazaniem orderId
      navigate(`/start/menu/basket/payment/${orderId}`);
    } catch (error) {
      console.error("Błąd podczas przechodzenia do płatności:", error);
    }
  };

  return (
    <div>
      <h2>Koszyk</h2>
      <div>
        <ul>
          {basket.map((item, index) => (
            <li key={index}>
              <p>{item.name}</p>
              <p>{item.price}</p>
              <p>Ilość: {item.quantity}</p>
              <p>Dodatkowe elementy: {item.extraItems}</p>
              <button onClick={() => editProduct(item)}>Edytuj</button>
              <button onClick={() => removeProduct(index)}>Usuń</button>
            </li>
          ))}
        </ul>
        {product && (
          <EditProductInBasket
            item={product}
            stopEditing={() => setProduct(null)}
            onSubmit={(editedProduct) =>
              handleSubmit(editedProduct, basket.indexOf(product))
            }
          />
        )}
        {basket.length > 0 && (
          <div>
            <button onClick={clearBasket}>Usuń wszystkie</button>
            <button onClick={() => navigate("/start/menu")}>
              Powrót do Menu
            </button>
            <button onClick={() => startPayment()}>Przejdź do płatności</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Basket;
