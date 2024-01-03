const express = require("express");
const historyRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

historyRoutes.route("/history/add").post(async (req, res) => {
  try {
    const { order, takeout, totalAmount, orderNumber, orderId } = req.body;

    const data = {
      _id: ObjectId(orderId),
      order,
      takeout,
      totalAmount,
      date: new Date(),
      orderNumber,
    };

    await dbo.getDb("mcdonalds").collection("history").insertOne(data);

    res.json({
      success: true,
      message: "Dodano zamówienie do archiwum.",
      orderId: data._id,
    });
  } catch (error) {
    console.error("Błąd podczas dodawania zamówienia do archiwum:", error);
    res.sendStatus(500);
  }
});

historyRoutes
  .route("/history/getOrderNumber/:orderId")
  .get(async (req, res) => {
    try {
      const { orderId } = req.params;

      const order = await dbo
        .getDb("mcdonalds")
        .collection("history")
        .findOne({ _id: ObjectId(orderId) });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Nie znaleziono zamówienia w historii.",
        });
      }

      const orderNumber = order.orderNumber;
      res.json({ orderNumber });
    } catch (error) {
      console.error(
        "Błąd podczas pobierania numeru zamówienia z historii:",
        error
      );
      res.sendStatus(500);
    }
  });

historyRoutes.route("/statistics/daily").get((req, res) => {
  function getDailyStatistics() {
    return new Promise(async (resolve, reject) => {
      try {
        const dailyStatistics = await dbo
          .getDb("mcdonalds")
          .collection("history")
          .aggregate([
            {
              $group: {
                _id: {
                  $dateToString: { format: "%d.%m.%Y", date: "$date" },
                },
                totalAmount: { $sum: { $toDouble: "$totalAmount" } },
                numberOfOrders: { $sum: 1 },
              },
            },
          ])
          .toArray();

        resolve(dailyStatistics);
      } catch (error) {
        reject(error);
      }
    });
  }
  getDailyStatistics()
    .then((dailyStatistics) => res.json(dailyStatistics))
    .catch((error) => {
      console.error("Błąd podczas pobierania statystyk dziennych:", error);
      res.sendStatus(500);
    });
});

historyRoutes.route("/statistics/monthly").get((req, res) => {
  function getMonthlyStatistics() {
    return new Promise(async (resolve, reject) => {
      try {
        const monthlyStatistics = await dbo
          .getDb("mcdonalds")
          .collection("history")
          .aggregate([
            {
              $group: {
                _id: {
                  $dateToString: { format: "%m.%Y", date: "$date" },
                },
                totalAmount: { $sum: { $toDouble: "$totalAmount" } },
                numberOfOrders: { $sum: 1 },
              },
            },
          ])
          .toArray();

        resolve(monthlyStatistics);
      } catch (error) {
        reject(error);
      }
    });
  }
  getMonthlyStatistics()
    .then((monthlyStatistics) => res.json(monthlyStatistics))
    .catch((error) => {
      console.error("Błąd podczas pobierania statystyk miesięcznych:", error);
      res.sendStatus(500);
    });
});

module.exports = historyRoutes;
