const express = require('express')
const bodyParser = require('body-parser')

const authenticate = require('../authenticate')
const cors = require('./cors')
const cartController = require('../controllers/cartController')


cartRouter = express.Router()
cartRouter.use(bodyParser.json())

cartRouter.route('/')
    .options(cors.cors, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.verifyUser, cartController.getCartItems)
    .post(cors.cors, authenticate.verifyUser, cartController.addItemToCart)
    .delete(cors.cors, authenticate.verifyUser, cartController.deleteCartItems)
cartRouter.route('/:cartId')
    .options(cors.cors, (req, res) => { res.sendStatus(200) })
    .put(cors.cors, authenticate.verifyUser, cartController.editCartItem)

module.exports = cartRouter;