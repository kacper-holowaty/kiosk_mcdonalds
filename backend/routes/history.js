const express = require("express");
const historyRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const yup = require("yup");

const addHistorySchema = yup.object().shape({
  order: yup.array().min(1).required(),
  takeout: yup.boolean().required(),
  totalAmount: yup
    .string()
    .matches(/^\d+\.\d{2}$/)
    .required(),
  date: yup.date().required(),
  orderNumber: yup
    .string()
    .matches(/^0\d{2}$/)
    .required(),
});

historyRoutes.route("/history/add").post(async (req, res) => {
  try {
    const { order, takeout, totalAmount, orderNumber, orderId } = req.body;

    await addHistorySchema.validate(
      {
        order,
        takeout,
        totalAmount,
        date: new Date(),
        orderNumber,
      },
      { abortEarly: false }
    );

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
                  $dateToString: { format: "%Y-%m-%d", date: "$date" },
                },
                totalAmount: { $sum: { $toDouble: "$totalAmount" } },
                numberOfOrders: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ])
          .toArray();

        dailyStatistics.forEach((stat) => {
          stat.totalAmount = parseFloat(stat.totalAmount.toFixed(2));
        });

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
                  $dateToString: { format: "%Y-%m", date: "$date" },
                },
                totalAmount: { $sum: { $toDouble: "$totalAmount" } },
                numberOfOrders: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ])
          .toArray();

        monthlyStatistics.forEach((stat) => {
          stat.totalAmount = parseFloat(stat.totalAmount.toFixed(2));
        });

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
