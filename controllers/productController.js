const mongoose = require('mongoose');
const Bluebird = require('bluebird');
Bluebird.promisifyAll(require('mongoose'));
const Products = require('../models/products')
const Sizes = require('../models/size')
//
exports.getProductItems = async (req, res, next) => {
    try {
        const product = await Products.find(req.query)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    } catch (error) {
        next(error);
    }
}
exports.addProductItems = async (req, res, next) => {
    try {
        const { sizes, ...rest } = req.body
        const product = await Products.create(rest)
        // console.log('product', product._id);
        const sizesWithProduct = sizes.map((size) => ({
            ...size,
            product: product._id
        }))
        await Sizes.create(sizesWithProduct)
        const [createdProduct, createdSizes] = await Bluebird.all([
            Products.findById(product._id).lean(),
            Sizes.find({ product: product._id }).lean()
        ])
        const result = { ...createdProduct, sizes: createdSizes }

        console.log('Thêm sản phẩm thành công', product)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(result)
    } catch (error) {
        next(error);
    }
}

exports.deleteProductItems = async (req, res, next) => {
    try {
        const [resp] = await Bluebird.all([
            Products.remove({}),
            Sizes.remove({})
        ])
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
            .lean()
        if (!product) {
            var err = new Error(`Sản phẩm ${req.params.productId} không tồn tại`)
            err.status = 404
            next(err)
        }
        const sizes = await Sizes.find({ product: product._id })
            .select('-_id name numberInStock')
            .lean()
        const result = { ...product, sizes }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(result);
    } catch (error) {
        next(error)
    }
}
exports.editProductById = async (req, res, next) => {
    try {
        const id = req.params.productId
        const product = await Products.findById(id).lean()
        const { sizes, ...rest } = req.body
        const { price, originalPrice } = { ...product, ...rest }
        if (price > originalPrice) {
            var err = new Error('Gía Bán không thể lớn hơn giá gốc')
            err.status = 400
            next(err)
        }
        const updateProduct = await Products.findByIdAndUpdate(id, {
            $set: rest
        }, { new: true })
            .lean()
            .exec()

        const updateSizes = sizes ? await Bluebird.map(sizes, (size) => {
            const { name } = size
            return Sizes.findOneAndUpdate(
                { name, product: id }, {
                $set: { ...size, product: id }
            }, { upsert: true, new: true })
                .lean()
                .exec()
        }) : await Sizes.find({ product: id }).lean()
        await Sizes.deleteMany({
            _id: { $nin: updateSizes.map((size) => size._id) },
            product: id
        })

        const result = { ...updateProduct, ...updateSizes }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (error) {
        next(error);
    }

}

exports.deleteProductById = async (req, res, next) => {
    try {
        const product = await Products.findByIdAndRemove(req.params.productId).lean()
        const allsize = await Sizes.deleteMany({ product: { $in: req.params.productId } }).lean()
        const result = { ...product, ...allsize }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    } catch (error) {
        next(error);
    }
}