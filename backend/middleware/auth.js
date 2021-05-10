//Import du package jsonwebtoken pour créer un token d'identification
//pour chaque utilisateur connecté et authentifié
const jwt = require("jsonwebtoken");

//Ce middleware permettra de protéger les routes sélectionnées
//et permettra de vérifier que l'utilisateur est authentifié
//avant d'autoriser l'envoi de requêtes
module.exports = function(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId){
            throw "User ID non valable !";
        }else{
            next();
        }
    }catch(error){
        res.status(401).json({ error: error | "Requête non authentifiée !"});
    }
};