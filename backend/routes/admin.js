const express = require("express");
const adminRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const adminData = require("../data/adminData.json");

adminRoutes.route("/login").post(async function (req, res) {
  const { login, password } = req.body;

  if (login === adminData.login && password === adminData.password) {
    res.json({
      success: true,
      isAdmin: true,
      message: "Zalogowano jako administrator.",
    });
  } else {
    res.json({
      success: false,
      isAdmin: false,
      message: "Nieprawidłowe dane logowania.",
    });
  }
});

module.exports = adminRoutes;
