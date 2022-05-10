const express = require('express')
const bodyParser = require('body-parser')

const cors = require('./cors')
const authenticate = require('../authenticate')
const orderController = require('../controllers/orderController')

const orderRouter = express.Router()
orderRouter.use(bodyParser.json())

orderRouter.route('/')
    .options(cors.cors, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors, authenticate.verifyUser, orderController.searchOrders)
    .post(cors.cors, authenticate.verifyUser, orderController.createOrder)
orderRouter.options('/:orderId/status/confirm-received', cors.cors, (req, res) => { res.sendStatus = 200; })
orderRouter.put('/:orderId/status/confirm-received', cors.cors, authenticate.verifyUser, orderController.confirmReceived)
orderRouter.options('/:orderId/status/cancel', cors.cors, (req, res) => { res.sendStatus = 200; })
orderRouter.put('/:orderId/status/cancel', cors.cors, authenticate.verifyUser, orderController.cancelOrder)

module.exports = orderRouter;
