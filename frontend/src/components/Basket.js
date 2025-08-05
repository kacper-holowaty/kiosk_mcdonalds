import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = "http://localhost:32001";

function Basket() {
  const { state, dispatch } = useAppContext();
  const { basket, takeout } = state;
  const navigate = useNavigate();

  const removeProduct = (index) => {
    dispatch({ type: "REMOVE_FROM_BASKET", payload: { id: index } });
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity > 0) {
      const updatedItem = { ...basket[index], quantity: newQuantity };
      dispatch({
        type: "UPDATE_BASKET",
        payload: { item: updatedItem, index },
      });
    }
  };

  useEffect(() => {
    if (basket.length === 0) {
      setTimeout(() => {
        navigate("/start/menu");
      }, 1000);
    }
  }, [basket, navigate]);

  const startPayment = async () => {
    try {
      const orderToSend = basket.map(({ image, ...rest }) => rest);
      const data = {
        order: orderToSend,
        takeout,
      };

      const response = await axios.post(`${backendUrl}/orders`, data);
      const orderId = response.data.orderId;

      navigate(`/start/menu/basket/payment/${orderId}`);
    } catch (error) {
      console.error("Błąd podczas przechodzenia do płatności:", error);
    }
  };

  const total = basket.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-bold mb-8 text-center">Koszyk</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        {basket.length === 0 ? (
          <p className="text-center text-gray-500">Koszyk jest pusty.</p>
        ) : (
          <>
            <ul>
              {basket.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border-b-2 pb-4 mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={`data:image/png;base64,${item.image}`}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="text-xl font-semibold">{item.name}</p>
                      <p className="text-gray-600">
                        Cena: {parseFloat(item.price).toFixed(2)} zł
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    >
                      -
                    </button>
                    <p className="mx-4 text-lg font-semibold">{item.quantity}</p>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeProduct(index)}
                      className="ml-6 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Usuń
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right">
              <p className="text-2xl font-bold">
                Suma: {total.toFixed(2)} zł
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
              <button
                onClick={() => dispatch({ type: "CLEAR_BASKET" })}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full sm:w-auto"
              >
                Wyczyść koszyk
              </button>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/start/menu")}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Powrót do Menu
                </button>
                <button
                  onClick={startPayment}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Przejdź do płatności
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Basket;
