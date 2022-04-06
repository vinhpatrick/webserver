const express = require('express')
const bodyParser = require('body-parser')

const authenticate = require('../authenticate')
const cors = require('./cors')
const cartController = require('../controllers/commentController')

cartRouter = express.Router()
cartRouter.use(bodyParser.json())

cartRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.corsWithOptions, authenticate.verifyUser, cartController.getCartItems)
    .post(cors.corsWithOptions, authenticate.verifyUser, cartController.addItemToCart)
    .delete(cors.corsWithOptions, authenticate.verifyUser, cartController.deleteCartItems)
cartRouter.route('/:cartId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .put(cors.corsWithOptions, authenticate.verifyUser, cartController.editCartItem)
module.exports = cartRouter;