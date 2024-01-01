const express = require("express");
const historyRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

historyRoutes.route("/history/add").post(async (req, res) => {
  try {
    const { order, totalAmount } = req.body;

    const data = {
      order,
      totalAmount,
      date: new Date().toLocaleString(),
    };

    await dbo.getDb("mcdonalds").collection("history").insertOne(data);

    res.json({
      success: true,
      message: "Dodano zamówienie do archiwum.",
    });
  } catch (error) {
    console.error("Błąd podczas dodawania zamówienia do archiwum:", error);
    res.status(500).json({
      success: false,
      message: "Błąd podczas dodawania zamówienia do historii płatności",
    });
  }
});

module.exports = historyRoutes;
