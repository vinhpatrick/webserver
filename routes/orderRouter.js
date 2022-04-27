const express = require('express')
const bodyParser = require('body-parser')

const cors = require('./cors')
const authenticate = require('../authenticate')
const orderController = require('../controllers/orderController')

const orderRouter = express.Router()
orderRouter.use(bodyParser.json())

orderRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.corsWithOptions, authenticate.verifyUser, orderController.searchOrders)
    .post(cors.corsWithOptions, authenticate.verifyUser, orderController.createOrder)
orderRouter.put('/:orderId/status/confirm-received',
    cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
    orderController.confirmReceived
)
orderRouter.put('/:orderId/status/cancel',
    cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,
    orderController.cancelOrder)

module.exports = orderRouter;
