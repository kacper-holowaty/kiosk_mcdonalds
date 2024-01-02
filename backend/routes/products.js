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

module.exports = productRoutes;
