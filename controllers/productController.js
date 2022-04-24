const mongoose = require('mongoose');
const Bluebird = require('bluebird');
Bluebird.promisifyAll(require('mongoose'));
const Products = require('../models/products')
const Sizes = require('../models/size');

//seacrh product
const _searchProductsAndAttachSizes = async (query, page, limit, sort) => {
    const products = await Products.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort)
        .lean()

    return Bluebird.map(
        products,
        async (product) => {
            const sizes = await Sizes.find({ product: product._id })
                .select('-_id name numberInStock')
                .lean()
            return { ...product, sizes }
        },
        { concurrency: products.length }
    )
}
const searchProducts = async (
    search = '',
    page = 1,
    limit = 20,
    sort = '-_id'
) => {
    const vPage = parseInt(page)
    const vLimit = parseInt(limit)

    // const query = { deletedAt: null }

    // if (shopId) {
    //     query.shop = shopId
    // }
    const query = { deletedAt: null }
    if (search) {
        query.$text = { $search: search }
    }

    const [products, total] = await Bluebird.all([
        _searchProductsAndAttachSizes(query, vPage, vLimit, sort),
        Products.countDocuments(query),
    ])

    const pages = Math.ceil(total / vLimit)

    return { products, total, pages, page: vPage }
}

exports.searchProducts = async (req, res, next) => {
    try {
        const { search, page, limit, sort } = { ...req.params, ...req.query }
        const products = await searchProducts(search, page, limit, sort)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(products);
    } catch (error) {
        next(error)
    }
}




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
//
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
        res.json({ success: true, result, status: 'Bạn đã thêm sản phẩm thành công' })
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
        // console.log('alll', product._id);
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