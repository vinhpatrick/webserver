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
    .get('/order-statistics', cors.cors, statisticsController.getOrderAmountStatistics)

module.exports = statisticsRouter;
