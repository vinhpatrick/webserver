const Bluebird = require('bluebird')
const Orders = require('../models/order')
const OrderItems = require('../models/orderitem')
const CartItems = require('../models/cartitem')
const Sizes = require('../models/size')
const { ORDER_STATUSES } = require('../helpers/index')


const searchOrders = async (args) => {
    const { status } = args
    const query = {}
    if (status) {
        query.status = status
    }
    const orders = await Orders.find(query)
        .populate('user')
        .sort('-_id')
        .lean()
    // console.log('order', orders);
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
        { concurrency: orders.length }//chỉ định số promises thực hiện đồng thời
    )
}


exports.searchOrders = async (req, res, next) => {
    try {
        const { status } = req.query

        const orders = await searchOrders({ status })
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(orders)
    } catch (error) {
        next(error)
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
                { $inc: { numberInStock: quantity } },//tăng số đơn lượng increase
            )
        },
        { concurrency: orderItems.length }
    )
}
const cancelOrder = async (orderId) => {
    const [cancelledOrder] = await Bluebird.all([
        Orders.findByIdAndUpdate(
            orderId,
            { $set: { status: ORDER_STATUSES.CANCELLED_BY_SELLER } },
            { new: true }
        ).lean(),
        _updateSizesWhenCancelOrder(orderId),
    ])

    return cancelledOrder
}

exports.cancelOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params

        const order = await cancelOrder(orderId)

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(order)
    } catch (error) {
        next(error)
    }
}




exports.confirmOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params
        const orderUpdate = await Orders.findByIdAndUpdate(orderId,
            { $set: { status: ORDER_STATUSES.IN_TRANSIT } },
            { new: true }
        ).lean()
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(orderUpdate)
    } catch (error) {
        return next(error)
    }
}