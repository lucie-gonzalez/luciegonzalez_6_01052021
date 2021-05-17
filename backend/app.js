//Import du framework Express
const express = require('express');
const app = express();

//Import du package body-parser pour traiter l'objet JSON
//envoyé par le frontend
const bodyParser = require('body-parser');

// Facilite les intéractions avec la BDD 
const mongoose = require('mongoose'); 

// Donne accès au chemin de notre système de fichier
const path = require('path'); 

// Installation de Helmet qui configure de manière appropriée des en-têtes HTTP liés à la sécurité
const helmet = require('helmet'); 

//Package mongo-express-sanitize : validation des données, enlève les données qui commencent par $, qui peuvent être utilisées par des hackers
const mongoSanitize = require("express-mongo-sanitize");

// sécurisation des données sensibles en les enregistrant dans un fichier .env
require('dotenv').config()

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Utilisation de Helmet
app.use(helmet());

// Je connecte la base de donnée MongoDB 
    mongoose.connect("mongodb+srv://" + process.env.DB_MONGODBCONNECT ,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true

    }).then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échoué !'));


//autorisation d acces à l'API

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // accéder à API depuis le port 4200
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // envoyer des requêtes avec les méthodes mentionnées
    next();
});

// indique à Express qu'il faut gérer la ressource images de manière statique 

app.use('/images', express.static(path.join(__dirname, 'images')));

//défininition de la fonction json comme middleware global pour l'application

app.use(bodyParser.json());

//Pour valider les inputs, enlever les caractères suspects commençant par $
app.use(mongoSanitize());

//enregistrement du routeur pour toutes les demandes faites vers /api/sauces

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;