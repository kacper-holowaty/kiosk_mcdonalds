import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import AdminPanel from "./AdminPanel";
import axios from "axios";

function Statistics() {
  const { state } = useAppContext();
  const { isAdmin } = state;
  const [dailyStatistics, setDailyStatistics] = useState([]);
  const [monthlyStatistics, setMonthlyStatistics] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/statistics/daily")
      .then((response) => setDailyStatistics(response.data))
      .catch((error) =>
        console.error("Błąd podczas pobierania statystyk dziennych:", error)
      );

    axios
      .get("http://localhost:5000/statistics/monthly")
      .then((response) => setMonthlyStatistics(response.data))
      .catch((error) =>
        console.error("Błąd podczas pobierania statystyk miesięcznych:", error)
      );
  }, []);
  return (
    <div>
      {isAdmin && <AdminPanel />}
      <div>
        <h2>Statystyki dziennie</h2>
        <ul>
          {dailyStatistics.map((stat) => (
            <li key={stat._id}>{`${stat._id}: ${stat.totalAmount} zł (${
              stat.numberOfOrders
            } ${
              stat.numberOfOrders === 1
                ? "zamówienie"
                : stat.numberOfOrders >= 2 && stat.numberOfOrders <= 4
                ? "zamówienia"
                : "zamówień"
            })`}</li>
          ))}
        </ul>

        <h2>Statystyki miesięczne</h2>
        <ul>
          {monthlyStatistics.map((stat) => (
            <li key={stat._id}>{`${stat._id}: ${stat.totalAmount} zł (${
              stat.numberOfOrders
            } ${
              stat.numberOfOrders === 1
                ? "zamówienie"
                : stat.numberOfOrders >= 2 && stat.numberOfOrders <= 4
                ? "zamówienia"
                : "zamówień"
            })`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Statistics;
