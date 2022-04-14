const Bluebird = require('bluebird')
const Orders = require('../models/order')
const OrderItems = require('../models/orderitem')
const CartItems = require('../models/cartitem')
const Sizes = require('../models/size')

exports.searchOrders = async (req, res, next) => {
    try {
        const { status } = req.query
        const user = req.user._id
        const query = { user }
        if (status) {
            query.status = status
        }
        const orders = await Orders.find(query)
            .sort('-_id')
            .lean()
        const [resp] = Bluebird.map(
            orders,
            async (order) => {
                const orderItem = await OrderItems.find({ order: order._id })
                    .populate('product')
                    .lean()
                const totalPrice = orderItem.reduce(
                    (total, item) => total + item.quantity * item.price,
                    0
                )
                return { ...order, totalPrice, items: orderItems }
            },
            {
                concurrency: orders.length
            }
        )
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    } catch (error) {
        next(error)
    }
}

exports.createOrder = async (req, res, next) => {
    try {
        const { cartItems, oderItems, ...rest } = req.body
        const orders = await Orders.create([rest])
        const order = orders[0]
        const orderItemsWithOrderId = orderItems.map((item) => ({ ...item, order: order._id }))
        const createdOrderItems = await OrderItems.create(orderItemsWithOrderId)
        await Bluebird.map(
            cartItems,
            async (itemId) => {
                const { product, size, quantity } = await CartItems.findById(itemId)
                    .lean()
                await Sizes.updateOne(
                    { product, name: size },
                    { $inc: { numberInStock: -quantity } }
                )
            },
            { concurrency: cartItems.length }
        )
        await CartItems.deleteMany({ _id: { $in: cartItems } })
        const createdOrder = await Orders.findById(order._id).lean()
        const resp = { ...createdOrder, items: createdOrderItems }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    } catch (error) {
        next(error)
    }
}