const express = require('express')
const bodyParser = require('body-parser')

const cors = require('./cors')
const authenticate = require('../authenticate')
const productController = require('../controllers/productController')

const productRouter = express.Router()
productRouter.use(bodyParser.json())

productRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, productController.searchProducts)
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, productController.addProductItems)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, productController.deleteProductItems)

productRouter.route('/:productId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, productController.getProductById)
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, productController.editProductById)

module.exports = productRouter;
