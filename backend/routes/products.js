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
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 \-,.()]{2,50}$/,
      "Nieprawidłowa nazwa produktu."
    )
    .required("Nazwa produktu jest wymagana"),
  type: yup
    .mixed()
    .test(
      'type-validation',
      'Nieprawidłowy typ produktu. Dozwolone znaki: litery, cyfry, spacje, -,.().',
      function(value) {
        if (typeof value === 'string') {
          return /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 \-,.()]{2,30}$/.test(value.trim());
        }
        if (Array.isArray(value)) {
          return value.length > 0 && 
                value.length <= 5 &&
                value.every(item => 
                  typeof item === 'string' && 
                  item.trim().length >= 2 &&
                  item.trim().length <= 30 &&
                  /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 \-,.()]{2,30}$/.test(item.trim())
                );
        }
        return false;
      }
    )
    .required("Typ produktu jest wymagany"),
  price: yup
    .string()
    .required("Cena produktu jest wymagana")
    .matches(/^\d+(\.\d{1,2})?$/, "Cena musi być liczbą z maksymalnie 2 miejscami po przecinku")
    .test(
      'price-range',
      'Cena musi być między 0.00 a 999.99',
      function(value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return numValue >= 0.00 && numValue <= 999.99;
      }
    ),
  image: yup
    .string()
    .required("Zdjęcie produktu jest wymagane")
    .test(
      'is-base64',
      'Zdjęcie musi być w formacie Base64',
      function(value) {
        if (!value) return false;
        try {
          if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value)) {
            return false;
          }
          return Buffer.from(value, 'base64').toString('base64') === value;
        } catch {
          return false;
        }
      }
    )
});

productRoutes.route("/products").get(async function (req, res) {
  try {
    const productsCollection = dbo.getDb("mcdonalds").collection("products");
    
    const results = await productsCollection.find({}).toArray();
    
    res.json(results);
  } catch (error) {
    console.error("Błąd pobierania produktów:", error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania produktów" });
  }
});

productRoutes.route("/products/:category?").get(async function (req, res) {
  try {
    const productsCollection = dbo.getDb("mcdonalds").collection("products");

    const allProducts = await productsCollection.find({}, { projection: { type: 1 } }).toArray();
    
    const uniqueCategories = new Set();
    
    allProducts.forEach(product => {
      if (typeof product.type === 'string') {
        uniqueCategories.add(product.type);
      } else if (Array.isArray(product.type)) {
        product.type.forEach(t => uniqueCategories.add(t));
      }
    });
    
    const categoriesArray = Array.from(uniqueCategories);

    const category = req.params.category || 
                    (categoriesArray.length > 0 ? categoriesArray[0] : null);

    let query = {};
    
    if (category) {
      query = {
        $or: [
          { type: category },
          { type: { $in: [category] } }
        ]
      };
    }

    const results = await productsCollection.find(query).toArray();

    res.json(results)

  } catch (error) {
    console.error("Błąd pobierania produktów według kategorii:", error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania produktów" });
  }
});

productRoutes.route("/categories").get(async function (req, res) {
  try {
    const productsCollection = dbo.getDb("mcdonalds").collection("products");
    
    const allProducts = await productsCollection.find({}, { projection: { type: 1 } }).toArray();
    
    const uniqueCategories = new Set();
    
    allProducts.forEach(product => {
      if (typeof product.type === 'string') {
        uniqueCategories.add(product.type);
      } else if (Array.isArray(product.type)) {
        product.type.forEach(t => uniqueCategories.add(t));
      }
    });
    
    const categoriesArray = Array.from(uniqueCategories).sort();
    
    res.json(categoriesArray);
    
  } catch (error) {
    console.error("Błąd pobierania kategorii:", error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania kategorii" });
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

    const result = await db_connect
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Produkt o podanym ID nie został znaleziony." });
    }

    res.json({ message: "Produkt został pomyślnie usunięty." });

  } catch (error) {
    console.error("Błąd podczas usuwania produktu:", error);
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
      .findOne({ 
        name: req.body.name.trim(), 
        _id: { $ne: new ObjectId(productId) } 
      });

    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Produkt o tej nazwie już istnieje." });
    }

    const updatedProduct = {
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      image: req.body.image
    };

    const result = await db_connect
      .collection("products")
      .updateOne({ _id: new ObjectId(productId) }, { $set: updatedProduct });

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ error: "Produkt o podanym identyfikatorze nie istnieje." });
    }

    res.json({ message: "Produkt został zaktualizowany pomyślnie." });

  } catch (error) {
    console.error("Błąd podczas aktualizacji produktu:", error);
    
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Wystąpił błąd podczas aktualizacji produktu." });
    }
  }
});

productRoutes.route("/products").post(async function (req, res) {
  let db_connect = dbo.getDb("mcdonalds");

  try {
    await productSchema.validate(req.body);

    const existingProduct = await db_connect
      .collection("products")
      .findOne({ name: req.body.name.trim() });

    if (existingProduct) {
      return res.status(400).json({ error: "Produkt o tej nazwie już istnieje." });
    }

    let myobj = {
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      image: req.body.image
    };

    const result = await db_connect.collection("products").insertOne(myobj);
    
    res.status(201).json({ 
      message: "Produkt został dodany.",
      productId: result.insertedId 
    });

  } catch (error) {
    console.error("Błąd podczas dodawania produktu:", error);
    
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Wystąpił błąd podczas dodawania produktu." });
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
