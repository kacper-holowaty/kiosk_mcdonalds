import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import EditProductInBasket from "./EditProductInBasket";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL

function Basket() {
  const { state, dispatch } = useAppContext();
  const { basket, takeout } = state;
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
        takeout,
      };

      const response = await axios.post(`${backendUrl}/orders`, data);
      const orderId = response.data.orderId;

      navigate(`/start/menu/basket/payment/${orderId}`);
    } catch (error) {
      console.error("Błąd podczas przechodzenia do płatności:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold mb-4 text-center mx-auto">Koszyk</h2>
      <div>
        <ul>
          {basket.map((item, index) => (
            <li key={index} className="border-b-2 pb-2 mb-4 w-1/3">
              <p className="text-xl font-semibold">{item.name}</p>
              <p>
                Cena {" (za 1 sztukę): "}
                {item.price} zł
              </p>
              <p>Ilość: {item.quantity}</p>
              <p>Dodatkowe elementy: {item.extraItems}</p>
              <div className="flex mt-2">
                <button
                  onClick={() => editProduct(item)}
                  className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => removeProduct(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md"
                >
                  Usuń
                </button>
              </div>
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
            <button
              onClick={() => dispatch({ type: "CLEAR_BASKET" })}
              className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Usuń wszystkie
            </button>
            <button
              onClick={() => navigate("/start/menu")}
              className="fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Powrót do Menu
            </button>
            <button
              onClick={() => startPayment()}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Przejdź do płatności
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Basket;
