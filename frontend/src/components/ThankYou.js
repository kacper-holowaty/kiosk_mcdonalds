import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ThankYou() {
  const { orderId } = useParams();
  const [orderNumber, setOrderNumber] = useState("");
  useEffect(() => {
    const fetchOrderNumber = async () => {
      try {
        if (!orderId) {
          throw new Error("Brak numeru zamówienia.");
        }

        const response = await axios.get(
          `http://localhost:5000/history/getOrderNumber/${orderId}`
        );

        setOrderNumber(response.data.orderNumber);
      } catch (error) {
        console.error("Błąd podczas pobierania numeru zamówienia:", error);
      }
    };

    fetchOrderNumber();
  }, [orderId]);

  return (
    <div>
      <h1>Dziękujemy za wizytę!</h1>
      <div>Twój numer zamówienia: {orderNumber}</div>
    </div>
  );
}

export default ThankYou;
