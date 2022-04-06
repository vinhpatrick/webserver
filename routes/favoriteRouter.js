const express = require('express');
const bodyParser = require('body-parser');

const authenticate = require('../authenticate');
const cors = require('./cors');
const favoriteController = require('../controllers/favoriteController')

const Favorites = require('../models/favorites');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.corsWithOptions, authenticate.verifyUser, favoriteController.getFavoritesItems)
    .post(cors.corsWithOptions, authenticate.verifyUser, favoriteController.addFavoritesItems)


module.exports = favoriteRouter;