const { MongoClient } = require("mongodb");
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

//kod do dodania danych początkowych do bazy, najlepiej użyć jednorazowo, później zakomentować.
function insertProducts() {
  const collection = module.exports.getDb().collection("products");

  let counter = 0;

  const promises = initialData.map((product) => {
    return collection
      .updateOne({ name: product.name }, { $set: product }, { upsert: true })
      .then((res) => {
        counter += res.upsertedCount + res.modifiedCount;
      });
  });

  Promise.all(promises)
    .then(() => {
      console.log(
        `Dodano lub zmieniono ${counter} elementów w kolekcji products.`
      );
    })
    .catch((err) => {
      console.error(err);
    });
}
