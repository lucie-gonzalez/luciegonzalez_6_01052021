//Import du package Mongoose pour faciliter les interactions
//avec la BDD MongoDB
const mongoose = require("mongoose");

//Import du package Mongoose Unique Validator
//permettant qu'une adresse mail ne soit utilisée qu'une seule fois
const uniqueValidator = require("mongoose-unique-validator");

//Création du modèle User
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//Application du plugin Mongoose Unique Validator au modèle utilisateur
userSchema.plugin(uniqueValidator);

//Export du modèle utilisateur
module.exports = mongoose.model("User", userSchema);