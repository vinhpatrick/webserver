const mongoose = require('mongoose');
const CartItems = require('../models/cartitem')

exports.getCartItems = async (req, res, next) => {
    try {
        const cartitem = await CartItems.find({ user: req.user._id })
            .populate('user')
            .populate('dishes')
        if (!cartitem) {
            var err = new Error('You have no favourites!');
            err.status = 404;
            return next(err);
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cartitem)
        }
    } catch (error) {
        next(error);
    }
}
exports.addItemToCart = async (req, res, next) => {

}
exports.deleteCartItems = async (req, res, next) => {

}
exports.editCartItem = async (req, res, next) => {

}