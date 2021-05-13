//Import du package multer pour gérer les fichiers images
const multer = require("multer");

//Dictionnaire des différents types d'images
const MIME_TYPES = {
    "images/jpg": "jpg",
    "images/jped": "jpg",
    "images/png": "png"
};

//Constante permettant l'enregistrement des fichiers images
//dans le dossier images
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, "images");
    },
    filename: function(req, file, callback){
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        name.replace("." + extension, "_");
        callback(null, name + Date.now() + "." + extension);
    }
});

//Export de la configuration du multer
module.exports = multer({ storage }).single("image"); 