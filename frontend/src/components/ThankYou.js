import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ThankYou() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState("");
  useEffect(() => {
    const fetchOrderNumber = async () => {
      try {
        if (!orderId) {
          throw new Error("Brak numeru zamówienia.");
        }

        const response = await axios.get(
          `http://localhost:32001/history/getOrderNumber/${orderId}`
        );

        setOrderNumber(response.data.orderNumber);

        setTimeout(() => {
          navigate("/");
        }, 10000);
      } catch (error) {
        console.error("Błąd podczas pobierania numeru zamówienia:", error);
      }
    };

    fetchOrderNumber();
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4">Dziękujemy za wizytę!</h1>
      <div className="text-5xl font-semibold">
        Twój numer zamówienia: {orderNumber}
      </div>
    </div>
  );
}

export default ThankYou;
