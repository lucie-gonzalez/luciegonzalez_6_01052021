
  // Crypte le mote de passe
const bcrypt = require('bcrypt');
// Attribuer un token à l'utilisateur et permet de les vérifier
const jwt = require('jsonwebtoken');
// Masque l'email
const maskData = require("../node_modules/maskdata");

const User = require('../models/user');


// Masquage de l'email avec ****@****
const emailMask2Options = {
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 0,
  unmaskedEndCharactersAfterAt: 0,
  maskAtTheRate: false
};

//////////////////// INSCRIPTION ////////////////////
exports.signup = (req, res, next) => {
  // Sécuriser les champs
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

  const email = req.body.email;
  const password = req.body.password;
 
  if(email.match(emailRegex) && password.match(passwordRegex)) {
    // Crypter le mot de passe, sale 10x pour renforcer le cryptage
    bcrypt.hash(password, 10)
      .then(hash => {
        // Récupérer le hash du mot de passe à enregistrer dans la BDD
        const user = new User({
          // Masquer l'email
          email: maskData.maskEmail2(email, emailMask2Options),
          // Enregistrer le hash du mot de passe
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  } else {
      throw new Error("Mot de passe non sécurisé (ajoutez au moins un chiffre, un signe, une lettre minuscule et majuscule) ou email invalide.");
   }
};

//////////////////// CONNEXION ////////////////////
exports.login = (req, res, next) => {
  // Trouver l'utilisateur correspondant à l'email
    User.findOne({ email: maskData.maskEmail2(req.body.email, emailMask2Options) })
      // Vérifier si on a un utilisateur ou non
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Comparer le mot de passe et le hash
        bcrypt.compare(req.body.password, user.password)
          .then(valid => { 
            if (!valid) {
              // si c'est false alors la comparaison n'est pas bonne
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              // Vérifier le token a chaque requête par le front-end
              // Voir si les requêtes sont authentifiées
              token: jwt.sign(
                { userId: user._id },
                // clé secrète pour l'encodage
                process.env.TOKEN_SECRET,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };