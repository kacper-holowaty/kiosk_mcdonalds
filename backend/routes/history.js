const express = require("express");
const historyRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

historyRoutes.route("/history/add").post(async (req, res) => {
  try {
    const { order, totalAmount, orderNumber, orderId } = req.body;

    const data = {
      _id: ObjectId(orderId),
      order,
      totalAmount,
      date: new Date().toLocaleString(),
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
    res.status(500).json({
      success: false,
      message: "Błąd podczas dodawania zamówienia do historii płatności",
    });
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
      res.status(500).json({
        success: false,
        message: "Błąd podczas pobierania numeru zamówienia z historii.",
      });
    }
  });

module.exports = historyRoutes;
