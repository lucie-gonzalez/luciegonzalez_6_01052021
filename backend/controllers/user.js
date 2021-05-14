  
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
// appel de la fonction de hachage de bcrypt dans notre mot de passe et  « salage » du mot de passe 10 fois. Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé. 

// Il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré

// creation d un utilisateur et enregistrement dans la base de données, en renvoyant une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec.
// La fonction User.updateOne permets de récupérer l'id renvoyer par la BDD et de le sauvegarder dans la BDD

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save((err, user) => {
                if (err) {
                    return res.status(500).json({ error: err });
                } else {
                    User.updateOne({ email: req.body.email }, { userId: user.id }).then(result => {
                        return res.status(201).json({ message: 'Utilisateur créé !' });
                    })
                }

            });
        })
        .catch(error => res.status(500).json({ error }));
};



exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};