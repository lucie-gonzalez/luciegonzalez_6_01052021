
//Import du framework Express
const express = require("express");

//Import du package body-parser pour traiter l'objet JSON
//envoyé par le frontend
const bodyParser = require("body-parser");

//Import du package Mongoose pour faciliter les interactions
//avec la BDD MongoDB
const mongoose = require("mongoose");

//Import du path de Node
const path = require("path");

//Import du router des sauces
const saucesRoutes = require("./routes/sauces");

//Import du router des utilisateurs
const userRoutes = require("./routes/user");

// Variables d'environnement - masque les informations de logins
require('dotenv').config();

//Connexion de l'application à la base de données MongoDB
    mongoose.connect(process.env.DB_MONGODBCONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(function () {
        console.log('Connexion à MongoDB réussie !');
    })
    .catch(function () {
        console.log('Connexion à MongoDB échouée !');
    });

//Création d'une application Express
const app = express();

//Le middleware de l'application

//Ce middleware gère les erreurs de CORS : Cross Origin Resource Sharing.
//Il résoud les problèmes de communication entre des serveurs
//différents comme le port 3000 pour notre serveur et le port de l'application
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

//Transforme l'objet JSON envoyé par le frontend pour pouvoir l'exploiter
app.use(bodyParser.json());

//Service du dossier images pour les récupérer
app.use("/images", express.static(path.join(__dirname, "images")));

//Enregistrement du router pour toutes les requêtes
//ayant l'endpoint api/sauces
app.use("/api/sauces", saucesRoutes);

//Enregistrement du router pour toutes les requêtes
//ayant l'endpoint api/auth
app.use("/api/auth", userRoutes);

//Export de l'application Express
module.exports = app;