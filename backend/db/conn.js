const { MongoClient } = require("mongodb");
const fs = require('fs');
const path = require('path');

const Db = process.env.MONGO_URI;
console.log(Db);
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;
const initialData = require("../data/mcDonaldsProducts.json");

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (db) {
        _db = db.db("mcdonalds");
        console.log("Successfully connected to MongoDB.");
        // insertProducts();
      }
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};

function loadImageAsBase64(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      console.warn(`Zdjęcie nie znalezione: ${imagePath}`);
      return null;
    }
    
    const imageBuffer = fs.readFileSync(imagePath);

    return imageBuffer.toString('base64');
  } catch (error) {
    console.error(`Błąd wczytywania zdjęcia ${imagePath}:`, error);
    return null;
  }
}

// funkcja do wstawiania produktów do bazy danych (należy użyć jednorazowo)
async function insertProducts() {
  const collection = module.exports.getDb().collection("products");
  
  console.log("Rozpoczynam wstawianie produktów ze zdjęciami...");
  
  try {
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`W bazie już znajduje się ${existingCount} produktów. Pomiń wstawianie lub usuń istniejące produkty.`);
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const product of initialData) {
      try {
        const imagePath = path.join(__dirname, '../data/images', product.imageFile);
        
        const imageBase64 = loadImageAsBase64(imagePath);
        
        const productDocument = {
          name: product.name,
          type: product.type,
          price: product.price,
          image: imageBase64
        };

        if (!imageBase64) {
          delete productDocument.image;
        }

        if (!product.name || !product.type || !product.price) {
          console.error(`❌ Niepełne dane produktu: ${product.name}`);
          errorCount++;
          continue;
        }

        if (!/^\d+(\.\d{1,2})?$/.test(product.price)) {
          console.error(`❌ Nieprawidłowa cena dla produktu ${product.name}: ${product.price}`);
          errorCount++;
          continue;
        }

        const result = await collection.updateOne(
          { name: product.name }, 
          { $set: productDocument }, 
          { upsert: true }
        );

        if (result.upsertedCount > 0) {
          console.log(`✅ Dodano nowy produkt: ${product.name}`);
          successCount++;
        } else if (result.modifiedCount > 0) {
          console.log(`🔄 Zaktualizowano produkt: ${product.name}`);
          successCount++;
        }

      } catch (error) {
        console.error(`❌ Błąd przetwarzania produktu ${product.name}:`, error);
        errorCount++;
      }
    }

    console.log(`\n📊 Podsumowanie:`);
    console.log(`✅ Pomyślnie przetworzono: ${successCount} produktów`);
    console.log(`❌ Błędy: ${errorCount} produktów`);
    console.log(`📁 Łączna liczba produktów w bazie: ${await collection.countDocuments()}`);

  } catch (error) {
    console.error("Błąd podczas wstawiania produktów:", error);
  }
}

// funkcja do usunięcia wszystkich produktów
async function clearProducts() {
  const collection = module.exports.getDb().collection("products");
  const result = await collection.deleteMany({});
  console.log(`Usunięto ${result.deletedCount} produktów z bazy danych.`);
}
