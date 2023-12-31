import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PaymentPanel() {
  const [price, setPrice] = useState(null);

  const getTotalPrice = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`http://localhost:5000/orders/totalprice`)
        .then((response) => {
          resolve(response.data.totalAmount);
        })
        .catch((error) => {
          console.error("Błąd podczas pobierania ceny zamówienia:", error);
          reject(error);
        });
    });
  };

  useEffect(() => {
    getTotalPrice()
      .then((price) => setPrice(price))
      .catch((error) =>
        console.error("Błąd podczas pobierania ceny zamówienia:", error)
      );
  }, []);
  const navigate = useNavigate();
  return (
    <div>
      <h2>Podsumowanie zamówienia</h2>
      <p>
        Łączna cena zamówienia:{" "}
        {price !== null ? `${price} zł` : "Trwa obliczanie ceny..."}
      </p>
      <button onClick={() => navigate("/start/menu/basket")}>Powrót</button>
      <button>Zapłać</button>
    </div>
  );
}

export default PaymentPanel;
