const express = require("express");
const orderRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

orderRoutes.route("/orders").post(async (req, res) => {
  try {
    const { order, takeout } = req.body;

    if (takeout === null) {
      return res
        .status(400)
        .json({
          error:
            "Musisz wybrać, czy zamówienie ma być na miejscu czy na wynos.",
        });
    }

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ error: "Zamówienie nie może być puste!" });
    }

    const newOrder = order.map((item) => ({
      ...item,
      extraItems: Array.isArray(item.extraItems)
        ? item.extraItems
        : item.extraItems.split(",").map((item) => item.trim()),
      quantity: parseInt(item.quantity, 10),
    }));

    const result = await dbo
      .getDb("mcdonalds")
      .collection("orders")
      .insertOne({ order: newOrder, takeout });

    res.json({
      success: true,
      message: "Dodano zamówienie!",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("Błąd podczas dodawania zamówienia:", error);
    res.sendStatus(500);
  }
});

orderRoutes.route("/orders/totalprice/:orderId").get(async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await dbo
      .getDb("mcdonalds")
      .collection("orders")
      .aggregate([
        {
          $match: {
            _id: ObjectId(orderId),
          },
        },
        {
          $unwind: "$order",
        },
        {
          $project: {
            _id: 0,
            totalProductPrice: {
              $multiply: [
                { $toDouble: "$order.price" },
                { $toInt: "$order.quantity" },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalProductPrice" },
          },
        },
      ])
      .toArray();

    res.json({ totalAmount: result[0].totalAmount.toFixed(2) });
  } catch (error) {
    console.error("Błąd podczas pobierania danych zamówienia:", error);
    res.sendStatus(500);
  }
});

orderRoutes.route("/orders/delete/:orderId").delete(async (req, res) => {
  try {
    const { orderId } = req.params;
    await dbo
      .getDb("mcdonalds")
      .collection("orders")
      .deleteOne({ _id: ObjectId(orderId) });

    res.json({ success: true, message: "Opłacono zamówienie." });
  } catch (error) {
    console.error("Błąd podczas opłacania zamówienia:", error);
    res.sendStatus(500);
  }
});

orderRoutes.route("/orders/generate").get((req, res) => {
  req.app.locals.orderCounter = req.app.locals.orderCounter || 0;
  const generateOrderNumber = () => {
    const orderNumber = req.app.locals.orderCounter.toString().padStart(3, "0");

    if (req.app.locals.orderCounter % 100 === 99) {
      req.app.locals.orderCounter = 0;
    } else {
      req.app.locals.orderCounter++;
    }

    return orderNumber;
  };

  const orderNumber = generateOrderNumber();
  res.json({ orderNumber });
});

module.exports = orderRoutes;
