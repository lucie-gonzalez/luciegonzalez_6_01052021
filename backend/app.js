module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Permet de travailler avec les fichiers et les répertoires
const path = require('path');

//////////////////// SÉCURITÉ ////////////////////
// Journalisation des requêtes
const morgan = require('morgan');
// Analyser l'activité de l'application
const logger = require('./config/logger');
// Protection des cookies
const session = require('cookie-session');
// Sécuriser Express en définissant divers en-têtes HTTP
const helmet = require('helmet');
// Variables d'environnement - masque les informations de logins
require('dotenv').config({path: './config/.env'});
// Désactiver la mise en cache côté client
const nocache = require("nocache");
// Nettoyer des données contre les attaques par injection
const mongoSanitize = require('express-mongo-sanitize');
// Contrer les attaques XSS - Nettoyer les entrées utilisateur (POST, GET, paramètres d'URL)
const xss = require('xss-clean');

//////////////////// IMPORTATION DES ROUTES ////////////////////
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//////////////////// MISE EN PLACE DES PACKAGES ////////////////////
const app = express();
// limiter la charge que l'utilisateur soumet à l'application
app.use(express.json ({limite: '10kb'}));
app.use(helmet());
app.use(nocache());
app.use(mongoSanitize());
app.use(xss());
app.use(morgan('combined', { stream: logger.stream }));

//////////////////// CONNEXION À MONGODB ////////////////////
mongoose.connect('mongodb+srv://openclassroom:imth3dStWaHpVc3@sauce.3plzk.mongodb.net/Sauce?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//////////////////// CORS HEADERS - PERMET LA COMMUNICATION ENTRE LES LOCALHOST 3000/4200 ////////////////////
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//////////////////// MISE EN PLACE DE COOKIE-SESSION ////////////////////
let expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // expiration dans 1 heure
app.use(session({
  name: 'session',
  keys: [process.env.COOKIESECRET],
  cookie: { secure: false, // Si HTTPS mettre " True "
            httpOnly: true, // booléen indiquant si le cookie doit être envoyé uniquement via HTTP(S)
            domain: 'http://localhost:3000', // Domaine du cookie
            path: '/', // chemin du cookie
            expires: expiryDate // Date d'expiration du cookie
          }
  })
);

//////////////////// GÈRER LES RESSOURCES IMAGES DE MANIÈRES STATIQUES ////////////////////
app.use('/images', express.static(path.join(__dirname, 'images')));

//////////////////// LES ROUTES ////////////////////
app.use(bodyParser.json());
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//////////////////// EXPORT APP SUR TOUTE L'APP ////////////////////
module.exports = app;