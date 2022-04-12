const mongoose = require('mongoose')
const Favorites = require('../models/favorites')


exports.getFavoritesItems = async (req, res, next) => {
    try {
        const favorites = await Favorites.find({ user: req.user._id })
            .populate('user')
            .populate('product')
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

// exports.addFavoritesItems = async (req, res, next) => {
//     try {
//         const favorites = await Favorites.findOne({ user: req.body._id })
//         if (favorites !== null) {
//             var reqProducts = req.body
//             var favProducts = favorites.products
//             reqProducts.map((reqproduct) => {
//                 var alreadyProduct = favProducts.filter((product) => product.equals(reqproduct._id))
//                 if (alreadyProduct.length === 0) {
//                     favProducts.push(reqproduct._id)
//                 }
//             })
//             const newFavorites = await Favorites.findByIdAndUpdate(favorites._id, {
//                 $set: {
//                     user: req.user._id,
//                     product: favProducts
//                 }
//             }, { new: true })
//             const updateFavorites = await Favorites.findById(newFavorites._id)
//                 .populate('user')
//                 .populate('dishes')
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(updateFavorites);
//         } else {
//             var products = []
//             req.body.map((product) => {
//                 products.push(product._id)
//             })
//             const favorites = await Favorites.create({ user: req.user._id, products: products })
//             const updateFavorites = await Favorites.findById(favorites._id)
//                 .populate('user')
//                 .populate('dishes')
//             console.log('Favorites Created', updateFavorites);
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(updateFavorites);

//         }
//     } catch (error) {
//         next(error)
//     }
// }

exports.addFavoritesItems = async (req, res, next) => {
    try {
        const favorites = await Favorites.find({})
            .populate('product')
            .populate('user')
        var user;
        if (favorites)
            user = favorites.filter(fav => fa.user._id.toString() === req.user.id.toString())[0];
        if (!user)
            user = await new Favorites({ user: req.user.id })
        for (let i of req.body) {
            if (user.products.find((p_id) => {
                if (p_id._id) {
                    return p_id._id.toString() === i._id.toString();
                }
            }))
                continue;
            user.products.push(i._id);
        }
        const userFavs = await user.save()
        if (userFavs) {
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.json(userFavs);
            console.log("Thêm thành công sản phẩm yêu thích")
        }
    } catch (error) {
        next(error);
    }
}

exports.deleteAllFavorites = async (req, res, next) => {
    try {
        const resp = await Favorites.findOneAndDelete({ user: req.user._id })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    } catch (error) {
        next(error)
    }
}
//
exports.addFavoritesById = async (req, res, next) => {
    try {
        const favorites = await Favorites.find({})
            .populate('user')
            .populate('product')
        var user
        if (favorites)
            user = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0]
        if (!user)
            user = new Favorites({ user: req.user.id });
        if (!user.products.find((p_id) => {
            if (p_id._id)
                return p_id._id.toString() === req.params.productId.toString();
        }))
            user.products.push(req.params.productId);

        const userFavs = await user.save()
        if (userFavs) {
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.json(userFavs);
            console.log("Thêm thành công sản phẩm yêu thích")
        }
    } catch (error) {

    }
}
exports.deleteFavoriteById = async (req, res, next) => {

}