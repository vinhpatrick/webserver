const mongoose = require('mongoose')
const Favorites = require('../models/favorites')


exports.getFavoritesItems = async (req, res, next) => {
    try {
        const favorites = await Favorites.find({ user: req.user._id })
            .populate('user')
            .populate('products')
            .lean()
        if (!favorites) {
            var err = new Error("Bạn không có sản phẩm yêu thích !")
            err.status = 404
            return next(err)
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    } catch (error) {
        next(error);
    }
}

exports.addFavoritesItems = async (req, res, next) => {
    try {
        const { productId, userId } = req.body
        const favorites = await Favorites.findOne({
            user: userId
        })
            .populate('user')
            .populate('products')
        if (favorites !== null) {
            const { products } = favorites
            var len = 0
            const exitsProduct = products.filter((product) => {
                if (product._id.toString() === productId) {
                    len++;
                }
            })
            if (len > 0) {
                err = new Error('Sản phẩm ' + productId + ' đã có trong danh sách yêu thích!');
                err.status = 400;
                return next(err);
            } else {
                await favorites.products.push(productId)
                await favorites.save()
            }
        } else {
            const newFavorites = await Favorites.create({
                user: userId,
                products: [
                    productId
                ]
            })
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.json(newFavorites);
        }
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
    } catch (error) {
        next(error);
    }
}

exports.deleteFavoriteById = async (req, res, next) => {
    try {
        const productId = req.params.productId
        const favorites = await Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('products')
        if (favorites) {
            const { products } = favorites
            var proUpdate = favorites.products.filter((product) => {
                return !(product._id.toString() === req.params.productId)

            })
            console.log('proup', proUpdate);
            if (proUpdate.length === products.length) {
                var err = new Error("Sản phẩm bạn muốn xóa không có trong danh sách yêu thích!")
                err.status = 404
                return next(err)
            } else {
                const fvupdate = await Favorites.findByIdAndUpdate(favorites._id, {
                    $set: {
                        user: req.user._id,
                        products: proUpdate
                    }
                }, { new: true })
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.json(fvupdate);
            }
        }
        else {
            var err = new Error("Bạn chưa có sản phẩm yêu thích !")
            err.status = 404
            return next(err)
        }
    } catch (error) {
        next(error)
    }
}
