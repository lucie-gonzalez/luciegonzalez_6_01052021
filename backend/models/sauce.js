//Import du package Mongoose pour faciliter les interactions
//avec la BDD MongoDB
const mongoose = require('mongoose');

// Import de notre middelware qui va aider à sécuriser contre l'injection de code lors de la création et modification des sauces.
const validateSauce = require('../middleware/validateSauce');

// creation d un schéma de données 

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: {type: String, required: true, validate : validateSauce.nameValidator },
    manufacturer: {type: String, required: true,  validate : validateSauce.manufacturerValidator },
    description: {type: String, required: true,  validate : validateSauce.descriptionValidator },
    mainPepper: {type: String, required: true,  validate : validateSauce.mainPepperValidator },
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: { type: Number, default: 0}, 
    dislikes: { type: Number, default: 0},
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false }
});


//exportation du schéma en tant que modèle Mongoose appelé « Sauce », le rendant par là même disponible pour notre application Express.

module.exports = mongoose.model('Sauce', sauceSchema);