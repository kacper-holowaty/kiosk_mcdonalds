const express = require("express");
const productRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

productRoutes.route("/products").get(async function (req, res) {
  try {
    const productsCollection = dbo.getDb("mcdonalds").collection("products");
    const results = await new Promise((resolve, reject) => {
      productsCollection.find().toArray((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    res.send(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

productRoutes.route("/products/:category?").get(async function (req, res) {
  try {
    const productsCollection = dbo.getDb("mcdonalds").collection("products");

    const uniqueCategories = await productsCollection.distinct("type");

    const category =
      req.params.category ||
      (uniqueCategories.length > 0 ? uniqueCategories[0] : null);

    const results = await productsCollection
      .find(category ? { type: category } : {})
      .toArray();

    res.send(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

productRoutes.route("/categories").get(async function (req, res) {
  try {
    const productsCollection = dbo.getDb("mcdonalds").collection("products");
    const uniqueCategories = await productsCollection.distinct("type");
    res.send(uniqueCategories);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

productRoutes.route("/products/:id").delete(async function (req, res) {
  try {
    let db_connect = dbo.getDb("mcdonalds");
    const productId = req.params.id;

    if (!ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ error: "Nieprawidłowy identyfikator produktu." });
    }

    await db_connect
      .collection("products")
      .deleteOne({ _id: ObjectId(productId) });

    res.json({ message: "Produkt został pomyślnie usunięty." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wystąpił błąd podczas usuwania produktu." });
  }
});

productRoutes.route("/products/:id").put(async function (req, res) {
  try {
    let db_connect = dbo.getDb("mcdonalds");
    const productId = req.params.id;

    if (!ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ error: "Nieprawidłowy identyfikator produktu." });
    }

    const existingProduct = await db_connect
      .collection("products")
      .findOne({ name: req.body.name, _id: { $ne: ObjectId(productId) } });

    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Produkt o tej nazwie już istnieje." });
    }

    const updatedProduct = {
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
    };

    const result = await db_connect
      .collection("products")
      .updateOne({ _id: ObjectId(productId) }, { $set: updatedProduct });

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ error: "Produkt o podanym identyfikatorze nie istnieje." });
    }

    res.json({ message: "Produkt został zaktualizowany pomyślnie." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Wystąpił błąd podczas aktualizacji produktu." });
  }
});

module.exports = productRoutes;
