const express = require("express");
const productRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// productRoutes.route("/products");
// recordRoutes.route("/products").get(async (req, res) => {
//     try {
//         let db_connect = dbo.getDb("magazyn");

//         const { sortField, sortOrder, minPrice, maxPrice, nameFilter } = req.query;

//         const sort = {};
//         if (sortField && sortOrder) {
//             sort[sortField] = sortOrder === 'asc' ? 1 : -1;
//         }

//         const filters = {};

//         if (minPrice && maxPrice) {
//             filters.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
//         } else if (minPrice) {
//             filters.price = { $gte: parseInt(minPrice) };
//         } else if (maxPrice) {
//             filters.price = { $lte: parseInt(maxPrice) };
//         }

//         if (nameFilter) {
//             filters.name = { $regex: new RegExp(`^${nameFilter}`, 'i') };
//           }

//         const result = await db_connect
//             .collection("products")
//             .find(filters)
//             .sort(sort)
//             .toArray();

//         res.json(result);
//     } catch (error) {
//       console.error('Błąd podczas pobierania danych:', error);
//       res.status(500).json({ error: 'Błąd serwera' });
//     }
// });

// recordRoutes.route("/products").post(async function (req, res) {
//     let db_connect = dbo.getDb("magazyn");

//     try {
//       // Sprawdź, czy produkt o tej samej nazwie już istnieje
//       const existingProduct = await db_connect.collection("products").findOne({ name: req.body.name });

//       if (existingProduct) {
//         res.status(400).json({ error: "Produkt o tej nazwie już istnieje." });
//       } else {
//         // Dodaj nowy produkt do bazy danych
//         let myobj = {
//           name: req.body.name,
//           price: req.body.price,
//           description: req.body.description,
//           quantity: req.body.quantity,
//           unit: req.body.unit,
//         };

//         await db_connect.collection("products").insertOne(myobj);
//         res.json({ message: "Produkt został dodany." });
//       }
//     } catch (error) {
//       console.error("Błąd podczas dodawania produktu:", error);
//       res.status(500).json({ error: "Wystąpił błąd podczas dodawania produktu." });
//     }
// });

// recordRoutes.route("/products/:id").put(async function (req, res) {
//     try {
//         let db_connect = dbo.getDb("magazyn");
//         const productId = req.params.id;

//         // Sprawdź, czy productId jest poprawnym ObjectId
//         if (!ObjectId.isValid(productId)) {
//             return res.status(400).json({ error: "Nieprawidłowy identyfikator produktu." });
//         }

//         // Sprawdź, czy nazwa produktu jest unikalna (jeśli została zmieniona)
//         const existingProduct = await db_connect
//             .collection("products")
//             .findOne({ name: req.body.name, _id: { $ne: ObjectId(productId) } });

//         if (existingProduct) {
//             return res.status(400).json({ error: "Produkt o tej nazwie już istnieje." });
//         }

//         const updatedProduct = {
//             name: req.body.name,
//             price: req.body.price,
//             description: req.body.description,
//             quantity: req.body.quantity,
//             unit: req.body.unit,
//         };

//         const result = await db_connect.collection("products").updateOne(
//             { _id: ObjectId(productId) },
//             { $set: updatedProduct }
//         );

//         if (result.matchedCount === 0) {
//             return res.status(404).json({ error: "Produkt o podanym identyfikatorze nie istnieje." });
//         }

//         res.json({ message: "Produkt został zaktualizowany pomyślnie." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Wystąpił błąd podczas aktualizacji produktu." });
//     }
// });

// recordRoutes.route("/products/:id").delete(async function (req, res) {
//     try {
//         let db_connect = dbo.getDb("magazyn");
//         const productId = req.params.id;

//         // Sprawdź, czy productId jest poprawnym ObjectId
//         if (!ObjectId.isValid(productId)) {
//             return res.status(400).json({ error: "Nieprawidłowy identyfikator produktu." });
//         }

//         // Sprawdź, czy produkt istnieje
//         const existingProduct = await db_connect
//             .collection("products")
//             .findOne({ _id: ObjectId(productId) });

//         if (!existingProduct) {
//             return res.status(404).json({ error: "Produkt o podanym identyfikatorze nie istnieje." });
//         }

//         // Sprawdź, czy produkt jest na magazynie
//         if (existingProduct.quantity === 0) {
//             return res.status(400).json({ error: "Produkt nie jest dostępny na magazynie." });
//         }

//         // Usuń produkt
//         const result = await db_connect.collection("products").deleteOne({ _id: ObjectId(productId) });

//         if (result.deletedCount === 0) {
//             return res.status(500).json({ error: "Wystąpił błąd podczas usuwania produktu." });
//         }

//         res.json({ message: "Produkt został pomyślnie usunięty." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Wystąpił błąd podczas usuwania produktu." });
//     }
// });

// recordRoutes.route("/report").get(async function (req, response) {
//     try {
//       let db_connect = dbo.getDb("magazyn");

//       const report = await db_connect.collection("products").aggregate([
//         {
//           $group: {
//             _id: "$name",
//             totalQuantity: { $sum: "$quantity" },
//             totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             name: "$_id",
//             totalQuantity: 1,
//             totalValue: 1,
//           },
//         },
//       ]).toArray();

//       response.json(report);
//     } catch (error) {
//       console.error(error);
//       response.status(500).json({ error: "Wystąpił błąd podczas agregowania danych." });
//     }
//   });

module.exports = productRoutes;
