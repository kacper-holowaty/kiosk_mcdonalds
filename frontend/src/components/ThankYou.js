import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL

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
          `${backendUrl}/history/getOrderNumber/${orderId}`
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
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">
        Dziękujemy za wizytę!
      </h1>
      <p className="text-4xl sm:text-5xl mb-8">
        Twój numer zamówienia:{" "}
        <span className="font-bold text-green-500">{orderNumber}</span>
      </p>
      <img
        src="/happy-happy-happy-happy.gif"
        alt="Happy Cat"
        className="w-64 h-64 sm:w-80 sm:h-80"
      />
    </div>
  );
}

export default ThankYou;
