const express = require("express");
const adminRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const adminData = require("../data/adminData.json");

adminRoutes.route("/login").post(async function (req, res) {
  const { login, password } = req.body;

  try {
    if (login === adminData.login && password === adminData.password) {
      res.status(200).json({
        success: true,
        isAdmin: true,
        message: "Zalogowano jako administrator.",
      });
    } else {
      res.status(401).json({
        success: false,
        isAdmin: false,
        message: "Nieprawidłowe dane logowania.",
      });
    }
  } catch (error) {
    console.error("Wystąpił błąd podczas logowania", error);
    res.status(500).json({
      success: false,
      isAdmin: false,
      message: "Wystąpił błąd podczas logowania. Spróbuj ponownie później.",
    });
  }
});

module.exports = adminRoutes;
