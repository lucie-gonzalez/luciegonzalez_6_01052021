//Import du modèle de sauce
const Sauce = require("../models/Sauce");
//Import du file system
const fs = require("fs");

//Middleware pour la création d'une sauce
exports.createSauce = function (req, res, next) {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
        .then(function () {
            res.status(201).json({ message: "Sauce créée !" });
        })
        .catch(function (error) {
            res.status(400).json({ error });
        });
};

//Middleware pour modifier une sauce
exports.modifySauce = function (req, res, next) {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(function () {
            res.status(200).json({ message: "Sauce modifiée !" });
        })
        .catch(function (error) {
            res.status(400).json({ error });
        });
};

//Middleware pour supprimer une sauce
exports.deleteSauce = function (req, res, next) {
    Sauce.findOne({ _id: req.params.id })
        .then(function (sauce) {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, function () {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(function () {
                        res.status(200).json({ message: "Sauce supprimée !" });
                    })
                    .catch(function (error) {
                        res.status(400).json({ error });
                    });
            });
        })
        .catch(function (error) {
            res.status(500).json({ error });
        });
};

//Middleware pour récupérer une sauce à l'aide de son identifiant
exports.getOneSauce = function (req, res, next) {
    Sauce.findOne({ _id: req.params.id })
        .then(function (sauce) {
            res.status(200).json(sauce);
        })
        .catch(function (error) {
            res.status(404).json({ error });
        });
};

//Middleware pour récupérer toutes les sauces
exports.getAllSauces = function (req, res, next) {
    Sauce.find()
        .then(function (sauces) {
            res.status(200).json(sauces);
        })
        .catch(function (error) {
            res.status(400).json({ error });
        });
};

//Middleware pour liker ou disliker une sauce
exports.likeOneSauce = function (req, res, next) {
    const sauceId = req.params.id;
    const userId = req.body.userId;
    const mention = req.body.like;

    Sauce.findOne({ _id: sauceId })
        .then(function (sauce) {
            let tabUsersLiked = sauce.usersLiked;
            let tabUsersDisliked = sauce.usersDisliked;
            let userLike = sauce.likes;
            let userDislike = sauce.dislikes;
            let posLike = tabUsersLiked.indexOf(userId);
            let posDislike = tabUsersDisliked.indexOf(userId);
            if (mention == 1) {
                tabUsersLiked.push(userId);
            }
            if (mention == -1) {
                tabUsersDisliked.push(userId);
            }
            if (mention == 0 & posLike >= 0) {
                tabUsersLiked.splice(posLike, 1);
            }
            if (mention == 0 && posDislike >= 0) {
                tabUsersDisliked.splice(posDislike, 1);
            }
            userLike = tabUsersLiked.length;
            userDislike = tabUsersDisliked.length;
            Sauce.updateOne({ _id: sauceId }, {
                usersLiked: tabUsersLiked,
                usersDisliked: tabUsersDisliked,
                likes: userLike,
                dislikes: userDislike,
                _id: sauceId
            })
                .then(function () {
                    res.status(200).json({ message: "Sauce modifiée." });
                })
                .catch(function (error) {
                    res.status(400).json({ error });
                });
        })
        .catch(function (error) {
            res.status(404).json({ error });
        });
};