const Bluebird = require('bluebird')
const Orders = require('../models/order')
const OrderItems = require('../models/orderitem')
const CartItems = require('../models/cartitem')
const Sizes = require('../models/size')
const Products = require('../models/products')
const { ORDER_STATUSES } = require('../helpers/index')




const searchOrders = async (args) => {

    const { status, user } = args
    const query = { user }
    if (status) {
        query.status = status
    }
    const orders = await Orders.find(query)
        .populate('user')
        .sort('-_id')
        .lean()
    return Bluebird.map(
        orders,
        async (order) => {
            const orderItems = await OrderItems.find({ order: order._id })
                .populate('product')
                .lean()
            const totalPrice = orderItems.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            )
            return { ...order, totalPrice, items: orderItems }
        },
        {
            concurrency: orders.length
        }
    )
}
exports.searchOrders = async (req, res, next) => {
    try {
        const { status } = req.query
        const user = req.user._id

        const orders = await searchOrders({ status, user })

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(orders)
    } catch (error) {
        next(error)
    }
}





exports.createOrder = async (req, res, next) => {
    try {
        const { cartItems, orderItems, ...rest } = req.body
        const orders = await Orders.create([rest])
        const order = orders[0]
        const orderItemsWithOrderId = orderItems.map((item) => ({ ...item, product: item.productId, order: order._id }))
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
exports.confirmReceived = async (req, res, next) => {
    try {
        const { orderId } = req.params
        const order = await Orders.findByIdAndUpdate(orderId,
            { $set: { status: ORDER_STATUSES.DELIVERED } },
            { new: true }
        ).lean()
        const orderItems = await OrderItems.find({ order: orderId }).lean()
        await Bluebird.map(
            orderItems,
            async (item) => {
                const { product, quantity } = item
                await Products.updateOne(
                    { _id: product },
                    { $inc: { sold: quantity } },
                )
            }, { concurrency: orderItems.length }
        )
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(order)

    } catch (error) {
        return next(error)
    }
}

const _updateSizesWhenCancelOrder = async (orderId) => {
    const orderItems = await OrderItems.find({ order: orderId }).lean()
    return Bluebird.map(
        orderItems,
        async (item) => {
            const { product, size, quantity } = item
            await Sizes.updateOne(
                { product, name: size },
                { $inc: { numberInStock: quantity } },
            )
        },
        { concurrency: orderItems.length }
    )
}
exports.cancelOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params
        const [cancelOrder] = await Bluebird.all([
            Orders.findByIdAndUpdate(
                orderId,
                { $set: { status: ORDER_STATUSES.CANCELLED_BY_CUSTOMER } },
                { new: true }
            )
                .lean(),
            _updateSizesWhenCancelOrder(orderId),
        ])
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(cancelOrder)
    } catch (error) {
        next(error)
    }
}
