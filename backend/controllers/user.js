//Import du package de chiffrement bcrypt
//pour chiffrer et créer un hash des mots de passe utilisateur
const bcrypt = require("bcrypt");

//Import du package jsonwebtoken pour créer un token d'identification
//pour chaque utilisateur connecté et authentifié
const jwt = require("jsonwebtoken");
// Masque l'email
const maskData = require("../node_modules/maskdata");

//Import du modèle user
const User = require("../models/User");

// Masquage de l'email avec ****@****
const emailMask2Options = {
    maskWith: "*",
    unmaskedStartCharactersBeforeAt: 0,
    unmaskedEndCharactersAfterAt: 0,
    maskAtTheRate: false
  };

//Middleware pour l'inscription d'un utilisateur
exports.signUp = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(req.body.password, 10)
        .then(function(hash){
            const user = new User({
                email: maskData.maskEmail2(email, emailMask2Options),
                password: hash
            });
            user.save()
                .then(function(){
                    res.status(201).json({ message: "Utilisateur créé !" });
                })
                .catch(function(error){
                    res.status(400).json({ error });
                });
        })
        .catch(function(error){
            res.status(500).json({ error });
        });
};

//Middleware pour la connexion d'un utilisateur
exports.login = function (req, res, next) {
    User.findOne({  email: maskData.maskEmail2(req.body.email, emailMask2Options)})
        .then(function(user){
            if(!user){
                return res.status(401).json({ error : "Utilisateur non trouvé !"});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(function(valid){
                    if(!valid){
                        return res.status(401).json({ error : "Mot de passe incorrect !"});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            "RANDOM_TOKEN_SECRET",
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(function(error){
                    res.status(500).json({ error });
                });
        })
        .catch(function(error){
            res.status(500).json({ error });
        });
};