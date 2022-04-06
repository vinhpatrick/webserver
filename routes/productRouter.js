const express = require('express')
const bodyParser = require('body-parser')

const cors = require('./cors')
const authenticate = require('../authenticate')
const productController = require('../controllers/productController')

const productRouter = express.Router()
productRouter.use(bodyParser.json())

productRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, productController.getProductItems)
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, productController.addProductItems)
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, productController.editProductItems)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, productController.deleteProductItems)

productRouter.route('/:productId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, productController.getProductById)
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, productController.addProductById)
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, productController.editProductById)
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, productController.deleteProductById)

module.exports = productRouter;
