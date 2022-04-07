const mongoose = require('mongoose');
const Comments = require('../models/comments')

exports.getProductComments = async (req, res, next) => {
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

exports.addComment = async (req, res, next) => {
    try {
        if (Object.getOwnPropertyNames(req.body).length !== 0) {
            const ok = Object.getOwnPropertyNames(req.body).length === 0
            console.log("body:", ok);
            req.body.author = req.user._id
            const newComment = await Comments.create(req.body)
            const comment = await Comments.findById(newComment._id)
                .populate('author')
                .populate('product')
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
        } else {
            err = new Error('Không tìm thấy nhận xét trong nội dung!');
            err.status = 404;
            next(err);
        }
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
