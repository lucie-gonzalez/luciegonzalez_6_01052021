//Import du framework Express
const express = require("express");
//Création d'un router
const router = express.Router();

//Import du middleware pour un utilisateur
const userCtrl = require("../controllers/user");

//Les différentes routes avec leur endpoints pour les utilisateurs
router.post("/signup", userCtrl.signUp);
router.post("/login", userCtrl.login);

//Export du router pour les utilisateurs
module.exports = router;