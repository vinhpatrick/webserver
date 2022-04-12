const mongoose = require('mongoose');
const CartItems = require('../models/cartitem')
const Sizes = require('../models/size')

exports.getCartItems = async (req, res, next) => {
    try {
        const cartitem = await CartItems.find({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .lean()
        if (!cartitem) {
            var err = new Error('Bạn chưa có sản phẩm nào trong giỏ hàng !');
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
    try {
        const { product, size, user, quantity } = req.body
        const exitsCartItem = await CartItems.findOne({ product, size, user })
        if (!exitsCartItem) {
            return CartItems.create(product, size, user, quantity)
        }
        const newQuantity = quantity + exitsCartItem.quantity;
        const fullSize = await Sizes.findOne({ product, name: size }).lean()
        if (fullSize.numberInStock < newQuantity) {
            var err = new Error('Không còn đủ sản phẩm trong kho');
            err.status = 404
            return next(err)
        }
        exitsCartItem.quantity = newQuantity;
        exitsCartItem.save()
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json(exitsCartItem)
    } catch (error) {
        next(error)
    }
}
exports.deleteCartItems = async (req, res, next) => {
    try {
        const resp = await CartItems.deleteMany({ _id: { $in: req.body } })
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    } catch (error) {
        next(error)
    }
}
exports.editCartItem = async (req, res, next) => {
    try {
        const { id, quantity, size } = { ...req.params, ...req.body }
        const cartItemUpdate = await CartItems.findByIdAndUpdate(id, {
            $set: { size, quantity }
        }, { new: true }).lean()
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(cartItemUpdate)

    } catch (error) {
        next(error)
    }
}