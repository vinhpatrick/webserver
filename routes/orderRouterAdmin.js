const express = require('express')
const bodyParser = require('body-parser')

const cors = require('./cors')
const authenticate = require('../authenticate')
const orderAdminController = require('../controllers/orderAdminController')

const orderRouterAdmin = express.Router()
orderRouterAdmin.use(bodyParser.json())
orderRouterAdmin.route('/')
    .options(cors.cors, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors, orderAdminController.searchOrders)

orderRouterAdmin
    .options('/:orderId/status/confirm', cors.cors, (req, res) => { res.sendStatus = 200; })
orderRouterAdmin
    .put('/:orderId/status/confirm', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, orderAdminController.confirmOrder)
orderRouterAdmin.options('/:orderId/status/cancel', cors.cors, (req, res) => { res.sendStatus = 200; })
orderRouterAdmin.put('/:orderId/status/cancel', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, orderAdminController.cancelOrder)
module.exports = orderRouterAdmin;
