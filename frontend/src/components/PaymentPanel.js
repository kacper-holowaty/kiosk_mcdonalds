import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL

function PaymentPanel() {
  const [price, setPrice] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { state, dispatch } = useAppContext();
  const { basket, takeout } = state;

  useEffect(() => {
    const getTotalPrice = () => {
      return new Promise((resolve, reject) => {
        axios
          .get(`${backendUrl}/orders/totalprice/${orderId}`)
          .then((response) => {
            resolve(response.data.totalAmount);
          })
          .catch((error) => {
            console.error("Błąd podczas pobierania ceny zamówienia:", error);
            reject(error);
          });
      });
    };

    getTotalPrice()
      .then((price) => setPrice(price))
      .catch((error) =>
        console.error("Błąd podczas pobierania ceny zamówienia:", error)
      );
  }, [orderId]);

  const handlePayment = async () => {
    try {
      await axios.delete(`${backendUrl}/orders/delete/${orderId}`);

      const response = await axios.get(
        `${backendUrl}/orders/generate`
      );

      await axios.post(`${backendUrl}/history/add`, {
        order: basket,
        takeout,
        totalAmount: price,
        orderNumber: response.data.orderNumber,
        orderId,
      });

      await dispatch({ type: "CLEAR_BASKET" });
      await dispatch({ type: "SET_TAKEOUT_AS_NULL" });

      navigate(`/start/menu/basket/payment/goodbye/${orderId}`);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          Podsumowanie zamówienia
        </h2>
        <div className="space-y-4 text-lg">
          <div className="flex justify-between">
            <span className="font-semibold">Rodzaj zamówienia:</span>
            <span>{takeout ? "Na wynos" : "Na miejscu"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Łączna cena:</span>
            {price !== null ? (
              <strong className="text-2xl">{price} zł</strong>
            ) : (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate("/start/menu/basket")}
            className="w-full px-6 py-3 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors"
          >
            Powrót
          </button>
          <button
            onClick={handlePayment}
            disabled={price === null}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
            Zapłać
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPanel;
