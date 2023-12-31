import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function PaymentPanel() {
  const [price, setPrice] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

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
  }, [orderId]); // Dodaj orderId do tablicy zależności
  // const getTotalPrice = () => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(`http://localhost:5000/orders/totalprice/${orderId}`)
  //       .then((response) => {
  //         resolve(response.data.totalAmount);
  //       })
  //       .catch((error) => {
  //         console.error("Błąd podczas pobierania ceny zamówienia:", error);
  //         reject(error);
  //       });
  //   });
  // };

  // useEffect(() => {
  //   getTotalPrice()
  //     .then((price) => setPrice(price))
  //     .catch((error) =>
  //       console.error("Błąd podczas pobierania ceny zamówienia:", error)
  //     );
  // }, []);

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
