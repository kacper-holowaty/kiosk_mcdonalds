import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import AdminPanel from "./AdminPanel";
import axios from "axios";
import { Link } from "react-router-dom";

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
      {isAdmin ? (
        <div className="flex">
          <div className="w-1/2 p-4">
            <div className="bg-gray-200 p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-2 text-center">
                Statystyki dziennie
              </h2>
              <ul>
                {dailyStatistics.map((stat) => (
                  <li key={stat._id} className="mb-1">{`${stat._id}: ${
                    stat.totalAmount
                  } zł (${stat.numberOfOrders} ${
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
          <div className="w-1/2 p-4">
            <div className="bg-gray-200 p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-2 text-center">
                Statystyki miesięczne
              </h2>
              <ul>
                {monthlyStatistics.map((stat) => (
                  <li key={stat._id} className="mb-2">{`${stat._id}: ${
                    stat.totalAmount
                  } zł (${stat.numberOfOrders} ${
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
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="text-2xl">
            Nie możesz uzyskać dostępu do statystyk...
          </div>
          <div className="text-2xl mb-4 mt-1">Musisz się zalogować!</div>
          <Link to="/login">
            <button className="text-2xl bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none">
              Zaloguj się
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Statistics;
