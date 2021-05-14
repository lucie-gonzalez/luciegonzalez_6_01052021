// Création d un token pour gérer l'authentification  
const jwt = require('jsonwebtoken'); 

// sécurisation des données sensibles en les enregistrant dans un fichier .env
require('dotenv').config()

// Objet JSON encodé envoyé à un client qui s'est authentifié avec succès

//Ce middleware permettra de protéger les routes sélectionnées
//et permettra de vérifier que l'utilisateur est authentifié
//avant d'autoriser l'envoi de requêtes
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN,);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

