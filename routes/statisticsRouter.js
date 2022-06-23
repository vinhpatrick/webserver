const express = require('express')
const bodyParser = require('body-parser')

const cors = require('./cors')
const authenticate = require('../authenticate')
const statisticsController = require('../controllers/statisticsController')

const statisticsRouter = express.Router()
statisticsRouter.use(bodyParser.json())
statisticsRouter
    .options('/order-statistics', cors.cors, (req, res) => { res.sendStatus = 200; })
statisticsRouter
    .get('/order-statistics', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, statisticsController.getOrderAmountStatistics)
statisticsRouter
    .get('/order-statistics-by-month', cors.cors, statisticsController.getOrderAmountStatisticsByMonth)
statisticsRouter
    .get('/order-statistics/:userId', cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, statisticsController.getOrderAmountStatistics)
statisticsRouter
    .get('/myorder-statistics/:userId', cors.cors, authenticate.verifyUser, statisticsController.getOrderAmountStatistics)
statisticsRouter
    .get('/products/:id', cors.cors, statisticsController.getProductPriceStatistics)

module.exports = statisticsRouter;
