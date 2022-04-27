const express = require('express')
const bodyParser = require('body-parser')

const cors = require('./cors')
const authenticate = require('../authenticate')
const orderAdminController = require('../controllers/orderAdminController')

const orderRouterAdmin = express.Router()
orderRouterAdmin.use(bodyParser.json())
orderRouterAdmin.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.corsWithOptions, orderAdminController.searchOrders)

orderRouterAdmin.options('/:orderId/status/confirm', cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
orderRouterAdmin.put('/:orderId/status/confirm', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, orderAdminController.confirmOrder)
orderRouterAdmin.options('/:orderId/status/cancel', cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
orderRouterAdmin.put('/:orderId/status/cancel', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, orderAdminController.cancelOrder)
module.exports = orderRouterAdmin;
