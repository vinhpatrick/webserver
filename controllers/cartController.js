const mongoose = require('mongoose');
const CartItems = require('../models/cartitem')
const Sizes = require('../models/size')

exports.getCartItems = async (req, res, next) => {
    try {
        const cartItems = await CartItems.find({ user: req.user._id })
            .populate('user')
            .populate('product')
            .lean()
        if (!cartItems) {
            var err = new Error('Bạn chưa có sản phẩm nào trong giỏ hàng !');
            err.status = 404;
            return next(err);
        }
        // const [product, ...rest] = cartitem
        // console.log('product', product._id);
        const uniqueProductIds = cartItems
            .filter(
                (item, index, self) =>
                    self.findIndex(
                        (vItem) => vItem.product._id.toString() === item.product._id.toString()
                    ) === index
            )
            .map((item) => item.product._id)
        const allSizes = await Sizes.find({ product: { $in: uniqueProductIds } })
            .select('product name numberInStock')
            .lean()
        cartItems.forEach((item) => {
            item.product.sizes = allSizes.filter(
                (size) => size.product.toString() === item.product._id.toString()
            )
        })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cartItems)
    } catch (error) {
        next(error);
    }
}

const addItemToCart = async ({ product, size, user, quantity }) => {
    const exitsCartItem = await CartItems.findOne({ product, size, user })
    // console.log('exitcartitem', exitsCartItem);
    if (!exitsCartItem) {
        return CartItems.create({ product, size, user, quantity })
    }
    const newQuantity = quantity + exitsCartItem.quantity;
    const fullSize = await Sizes.findOne({ product, name: size }).lean()
    if (fullSize.numberInStock < newQuantity) {
        var err = new Error('Không còn đủ sản phẩm trong kho');
        err.status = 404
        return next(err)
    }
    exitsCartItem.quantity = newQuantity;
    return exitsCartItem.save()
}


exports.addItemToCart = async (req, res, next) => {
    try {
        const args = req.body
        const cart = await addItemToCart(args)
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json(cart)
    } catch (error) {
        next(error)
    }
}
exports.deleteCartItems = async (req, res, next) => {
    try {
        const { cartItemIds } = req.body
        const resp = await CartItems.deleteMany({ _id: { $in: cartItemIds } })
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    } catch (error) {
        next(error)
    }
}
exports.editCartItem = async (req, res, next) => {
    try {
        const { cartId } = req.params
        console.log('cartid', cartId);
        const { quantity, size } = { ...req.body }
        const cartItemUpdate = await CartItems.findByIdAndUpdate(cartId, {
            $set: { size, quantity }
        }, { new: true }).lean()
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(cartItemUpdate)

    } catch (error) {
        next(error)
    }
}