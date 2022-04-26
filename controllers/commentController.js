const mongoose = require('mongoose');
const Comments = require('../models/comments')
const Products = require('../models/products')

exports.getAllComments = async (req, res, next) => {
    try {
        const comments = await Comments.find(req.query)
            .populate('author')
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comments);
    } catch (error) {
        next(error);
    }
}

const _recalculateProductRating = async (productId) => {
    const allComments = await Comments.find({ product: productId })
        .select('rating')
        .lean()

    const totalRating = allComments.reduce((total, comment) => total + comment.rating, 0)
    const newProductRating = allComments.length ? totalRating / allComments.length : 5

    await Products.updateOne(
        { _id: productId },
        { $set: { ratting: Math.round(newProductRating * 100) / 100 } },
    )
}


exports.addComment = async (req, res, next) => {
    try {
        // console.log('body', req.body);
        const { author, product, comment, ratting } = req.body
        // console.log('author', author)
        const createdComment = await Comments.create(
            { author, product, comment, ratting }
        )
        await _recalculateProductRating(product)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(createdComment);
    } catch (error) {
        next(error);
    }
}

exports.deleteAllComment = async (req, res, next) => {
    try {
        const resp = await Comments.remove({})
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    } catch (error) {
        next(error);
    }
}

exports.deleteCommentById = async (req, res, next) => {
    try {
        const comment = await Comments.findById(req.params.commentId)
        if (comment !== null) {
            if (!comment.author.equals(req.user._id)) {
                var err = new Error('Bạn không có quyền xóa comments!!');
                err.status = 403;
                return next(err);
            }
            const resp = await Comments.findByIdAndRemove(req.params.commentId)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        } else {
            err = new Error('Comment' + req.params.commentId + 'not found');
            err.status = 404;
            return next(err);
        }
    } catch (error) {
        next(error);
    }
}
