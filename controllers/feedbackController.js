const mongoose = require('mongoose')
const Feedbacks = require('../models/feedback')

exports.getFeedbacks = async (req, res, next) => {
    try {
        const feedback = await Feedbacks.find({})
        if (feedback) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(feedback)
        } else {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({ status: 'Chưa có phản nào nào về cửa hàng!' })
        }
    } catch (error) {
        return next(error)
    }
}
exports.addFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedbacks.create(req.body)
        if (feedback) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(feedback)
        } else {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.json({ status: 'Lỗi hệ thống vui lòng thử lại sau!' })
        }
    } catch (error) {
        return next(error)
    }
}