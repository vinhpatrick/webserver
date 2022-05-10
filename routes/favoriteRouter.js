const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const cors = require('./cors');
const favoriteController = require('../controllers/favoriteController')

const Favorites = require('../models/favorites');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.cors, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors, authenticate.verifyUser, favoriteController.getFavoritesItems)
    .post(cors.cors, authenticate.verifyUser, favoriteController.addFavoritesItems)
// .delete(cors.corsWithOptions, authenticate.verifyUser, favoriteController.deleteAllFavorites)
favoriteRouter.route('/:productId')
    .options(cors.cors, (req, res) => { res.sendStatus = 200; })
    .delete(cors.cors, authenticate.verifyUser, favoriteController.deleteFavoriteById)

module.exports = favoriteRouter;