const mongoose = require('mongoose')
const Favorites = require('../models/favorites')


exports.getFavoritesItems = async (req, res, next) => {
    try {
        const favorites = await Favorites.find({ "user": req.user._id })
            .populate('user')
            .populate('dishes')
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    } catch (error) {
        next(error);
    }
}

exports.addFavoritesItems = async (req, res, next) => {
    try {
        const favorites = await Favorites.findOne({ "user": req.body._id })
        if (favorites !== null) {
            var reqProducts = req.body
            var favProducts = favorites.products
            reqProducts.map((reqproduct) => {
                var alreadyProduct = favProducts.filter((product) => product.equals(reqproduct._id))
                if (alreadyProduct.length === 0) {
                    favProducts.push(reqproduct._id)
                }
            })
            const newFavorites = await Favorites.findByIdAndUpdate(favorites._id, {
                $set: {
                    user: req.user._id,
                    product: favProducts
                }
            }, { new: true })
            const updateFavorites = await Favorites.findById(newFavorites._id)
                .populate('user')
                .populate('dishes')
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(updateFavorites);
        } else {
            var products = []
            req.body.map((product) => {
                products.push(product._id)
            })
            const favorites = await Favorites.create({ user: req.user._id, products: products })
            const updateFavorites = await Favorites.findById(favorites._id)
                .populate('user')
                .populate('dishes')
            console.log('Favorites Created', updateFavorites);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(updateFavorites);

        }
    } catch (error) {
        next(error)
    }
}

exports.deleteAllFavorites = async (req, res, next) => {
    try {
        const resp = await Favorites.findOneAndDelete({ "user": req.user._id })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    } catch (error) {
        next(error)
    }
}
exports.deleteFavoriteById = async (req, res, next) => {

}