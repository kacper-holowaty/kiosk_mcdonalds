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
          .get(`http://localhost:5000/orders/totalprice/${orderId}`)
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
      await axios.delete(`http://localhost:5000/orders/delete/${orderId}`);

      const response = await axios.get("http://localhost:5000/orders/generate");

      await axios.post("http://localhost:5000/history/add", {
        order: basket,
        takeout,
        totalAmount: price,
        orderNumber: response.data.orderNumber,
        orderId,
      });
      console.log(orderId);

      await dispatch({ type: "CLEAR_BASKET" });
      await dispatch({ type: "SET_TAKEOUT_AS_NULL" });

      navigate(`/start/menu/basket/payment/goodbye/${orderId}`);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
    }
  };

  return (
    <div>
      <h2>Podsumowanie zamówienia</h2>
      <p>Rodzaj zamówienia: {takeout ? "Na wynos" : "Na miejscu"}</p>
      <p>
        Łączna cena zamówienia:{" "}
        {price !== null ? `${price} zł` : "Trwa obliczanie ceny..."}
      </p>
      <button onClick={() => navigate("/start/menu/basket")}>Powrót</button>
      <button onClick={() => handlePayment()}>Zapłać</button>
    </div>
  );
}

export default PaymentPanel;
