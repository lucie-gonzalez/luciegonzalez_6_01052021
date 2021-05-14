const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); // Facilite les intéractions avec la BDD
const path = require('path'); // Donne accès au chemin de notre système de fichier
const helmet = require('helmet'); // Installation de Helmet qui configure de manière appropriée des en-têtes HTTP liés à la sécurité

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


//enregistrement du routeur pour toutes les demandes faites vers /api/sauces

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;