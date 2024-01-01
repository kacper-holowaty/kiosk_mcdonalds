import React, { useEffect, useState } from "react";
import axios from "axios";

function ThankYou() {
  const [orderNumber, setOrderNumber] = useState("");
  useEffect(() => {
    const fetchOrderNumber = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/orders/generate"
        );

        if (response.status !== 200) {
          throw new Error("Błąd podczas generowania numeru zamówienia");
        }

        setOrderNumber(response.data.orderNumber);
      } catch (error) {
        console.error("Błąd podczas pobierania numeru zamówienia: ", error);
      }
    };

    fetchOrderNumber();
  }, []);

  return (
    <div>
      <h1>Dziękujemy za wizytę!</h1>
      {orderNumber && <div>Twój numer zamówienia: {orderNumber}</div>}
    </div>
  );
}

export default ThankYou;
