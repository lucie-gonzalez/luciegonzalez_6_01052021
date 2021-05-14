const Sauce = require('../models/Sauce');
const fs = require('fs'); // « file system » Donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.


// Méthode POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de sauceObject
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() // Méthode save() qui enregistre dans la base de données.
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};


// Méthode POST pour liker ou disliker
exports.definedStatusSauce = (req, res, next) => {
    let updateObject;

    if (req.body.like === 1) {
        updateObject = {
            $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }
        }

    } else if (req.body.like === 0) {
        updateObject = {
            $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }
        }

    } else if (req.body.like === -1) {
        updateObject = {
            $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }
        }

    } else {
        updateObject = {
            $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }
        }
    }

    Sauce.updateOne({ _id: req.params.id }, updateObject)
        .then(() => res.status(200).json({ message: 'Vote done.' }))
        .catch(error => res.status(400).json({ error }));
};

// Méthode get() pour répondre uniquement aux demandes GET; 
// Nous utilisons deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // méthode findOne() dans notre modèle sauce pour trouver la sauce unique ayant le même _id que le paramètre de la requête ; 
        .then(sauce => res.status(200).json(sauce)) // cette sauce est ensuite retourné dans une Promise et envoyé au front-end ;
        .catch(error => res.status(404).json({ error })) // si aucune sauce n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée.
}

// Route qui répond aux requêtes PUT (pour modifier un objet) 
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // méthode updateOne() dans le modèle sauce . Permet de mettre à jour le sauce qui correspond à l'objet que nous passons comme premier argument. Nous utilisons aussi le paramètre id passé dans la demande et le remplaçons par la sauce passé comme second argument.
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};


// Route DELETE qui permets de supprimer un élément

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

//route GET : nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les sauces dans notre base de données.

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}