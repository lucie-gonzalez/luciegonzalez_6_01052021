//Import du package Mongoose pour faciliter les interactions
//avec la BDD MongoDB
const mongoose = require('mongoose');

//plug-in qui empêche d'utiliser plusieurs fois la même adresse email
const uniqueValidator = require('mongoose-unique-validator'); 

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    userId: { type: String, required: false}
});

//Application du plugin Mongoose Unique Validator au modèle utilisateur
userSchema.plugin(uniqueValidator);

//Export du modèle utilisateur
module.exports = mongoose.model('User', userSchema);