const mongoose = require('mongoose');
const Products = require('../models/products')
//
exports.getProductItems = async (req, res, next) => {
    try {
        const product = await Products.find(req.body)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    } catch (error) {
        next(error);
    }
}
exports.addProductItems = async (req, res, next) => {
    try {
        const product = await Products.create(req.body)
        console.log('Thêm sản phẩm thành công', product)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(product)
    } catch (error) {
        next(error);
    }
}
exports.editProductItems = async (req, res, next) => {
    try {
        res.end('Put không hỗ trợ trên /products!!');
    } catch (error) {
        next(error);
    }
}

exports.deleteProductItems = async (req, res, next) => {
    try {
        const resp = await Products.remove({})
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp);
    } catch (error) {
        next(error);
    }
}


//
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Products.findById(req.params.productId)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(product);
    } catch (error) {
        next(error)
    }
}
exports.addProductById = async (req, res, next) => {
    try {
        res.end('Post không hỗ trợ trên /products/ ' + req.params.productId);
    } catch (error) {
        next(error);
    }
}
exports.editProductById = async (req, res, next) => {
    try {
        const product = await Products.findByIdAndUpdate(req.params.productId, {
            $set: req.body
        }, { new: true })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    } catch (error) {
        next(error);
    }

}
exports.deleteProductById = async (req, res, next) => {
    try {
        const resp = await Products.findByIdAndRemove(req.params.productId)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    } catch (error) {
        next(error);
    }
}