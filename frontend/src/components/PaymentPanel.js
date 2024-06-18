import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

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
          .get(`http://localhost:32001/orders/totalprice/${orderId}`)
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
      await axios.delete(`http://localhost:32001/orders/delete/${orderId}`);

      const response = await axios.get(
        "http://localhost:32001/orders/generate"
      );

      await axios.post("http://localhost:32001/history/add", {
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
    <div className="flex flex-col items-center justify-center">
      <h2 className="font-bold text-4xl text-center mx-auto mt-0 pt-8 mb-8">
        Podsumowanie zamówienia
      </h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-lg w-1/2 flex flex-col items-center justify-center">
        <p className="text-2xl">
          Rodzaj zamówienia: {takeout ? "Na wynos" : "Na miejscu"}
        </p>
        <p className="text-2xl my-3">
          Łączna cena zamówienia:{" "}
          <strong>
            {price !== null ? `${price} zł` : "Trwa obliczanie ceny..."}
          </strong>
        </p>
        <div className="flex mt-4">
          <button
            onClick={() => navigate("/start/menu/basket")}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-blue-700 mr-10 text-xl"
          >
            Powrót
          </button>
          <button
            onClick={() => handlePayment()}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-green-700 text-xl"
          >
            Zapłać
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPanel;
