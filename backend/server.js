const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(require("./routes/products"));
app.use(require("./routes/orders"));
app.use(require("./routes/history"));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
const dbo = require("./db/conn");

app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
