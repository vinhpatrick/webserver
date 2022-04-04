const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({ "user": req.user._id })
            .populate('user')
            .populate('products')
            .then((Favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(Favorites)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ "user": req.user._id })
            .then((favorites) => {
                if (favorites !== null) {
                    var reqProducts = req.body;//gửi lên từ client
                    var favProducts = favorites.products;
                    reqProducts.map(reqproduct => {
                        var alreadyProduct = favProducts.filter((product) => product.equals(reqproduct._id));
                        if (alreadyProduct.length === 0) {
                            favProducts.push(reqproduct._id);
                        }
                    });
                    Favorites.findByIdAndUpdate(favorites._id, {
                        $set: {
                            user: req.user._id,
                            products: favProducts
                        }
                    }, { new: true })
                        .then((favorites) => {
                            Favorites.findById(favorites._id)
                                .populate('user')
                                .populate('products')
                                .then((favorites) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorites);
                                }, (err) => next(err))
                                .catch((err) => next(err))
                        })
                }
            })
    })


module.exports = favoriteRouter;