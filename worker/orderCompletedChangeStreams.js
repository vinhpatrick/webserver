const Bluebird = require('bluebird')
const moment = require('moment')

const { ORDER_STATUSES } = require('../helpers/index')
const OrderStatistics = require('../models/orderStatistics')
const Orders = require('../models/order')
const OrderItems = require('../models/orderitem')

const run = async () => {
    Orders.watch({ fullDocument: 'updateLookup' }).on('change', async (event) => {
        try {
            if (
                event.operationType === 'update' &&
                event.updateDescription?.updatedFields?.status === ORDER_STATUSES.DELIVERED
            ) {
                const { _id: orderId, user: userId } = event.fullDocument

                const [orderItems] = await Bluebird.all([
                    OrderItems.find({ order: orderId }).select('price quantity').lean(),
                ])

                const amount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
                OrderStatistics.create({
                    order: orderId,
                    user: userId,
                    amount,
                    capturedTime: moment(),
                })
            }
        } catch (error) {
            console.log(error)
        }
    })
}

exports.run = run


exports.run = run