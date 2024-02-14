const express = require("express");
const productRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const yup = require("yup");

const productSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .matches(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 ]{2,}$/,
      "Nieprawidłowa nazwa produktu"
    )
    .required("Nazwa produktu jest wymagana"),
  type: yup
    .string()
    .trim()
    .matches(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 ]{2,}$/,
      "Nieprawidłowy typ produktu"
    )
    .required("Typ produktu jest wymagany"),
  price: yup
    .number()
    .required("Cena produktu jest wymagana")
    .min(0.01, "Cena musi być większa niż 0")
    .max(1000, "Cena może wynosić maksymalnie 1000"),
});

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

    await productSchema.validate(req.body);

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
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Wystąpił błąd podczas aktualizacji produktu." });
    }
  }
});

productRoutes.route("/products").post(async function (req, res) {
  let db_connect = dbo.getDb("mcdonalds");

  try {
    await productSchema.validate(req.body);

    const existingProduct = await db_connect
      .collection("products")
      .findOne({ name: req.body.name });

    if (existingProduct) {
      res.status(400).json({ error: "Produkt o tej nazwie już istnieje." });
    }
    let myobj = {
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
    };

    await db_connect.collection("products").insertOne(myobj);
    res.json({ message: "Produkt został dodany." });
  } catch (error) {
    console.error("Błąd podczas dodawania produktu:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Wystąpił błąd podczas dodawania produktu." });
    }
  }
});

productRoutes.route("/admin/products").get(async function (req, res) {
  try {
    const productsCollection = dbo.getDb("mcdonalds").collection("products");
    const nameFilter = req.query.name || "";
    const categoryFilter = req.query.type || "";

    const query = {
      name: { $regex: new RegExp(`^${nameFilter}`, "i") },
    };

    if (categoryFilter) {
      query.type = categoryFilter;
    }

    const results = await productsCollection.find(query).toArray();

    res.send(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = productRoutes;
