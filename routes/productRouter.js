const express = require('express')
const bodyParser = require('body-parser')

const cors = require('./cors')
const authenticate = require('../authenticate')
const productController = require('../controllers/productController')

const productRouter = express.Router()
productRouter.use(bodyParser.json())

productRouter.route('/')
    .options(cors.cors, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, productController.searchProducts)
    .post(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, productController.addProductItems)
    .delete(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, productController.deleteProductItems)

productRouter.route('/:productId')
    .options(cors.cors, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, productController.getProductById)
    .put(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, productController.editProductById)

module.exports = productRouter;
