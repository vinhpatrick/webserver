const mongoose = require('mongoose')
const User = require('../models/user')

exports.updateCurrentUser = async (req, res, next) => {
    try {
        const args = req.body
        const id = req.user._id
        // console.log('data', req.body);
        const updateUser = await User.findByIdAndUpdate(id, { $set: args }, { new: true })
            .select('-hash -salt -__v')
            .lean()
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json'),
            res.json(updateUser)
    } catch (error) {
        next(error)
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const id = req.user._id
        const user = await User.findById(id)
        if (!user) {
            var err = new Error(`Người dùng với ${id} không tồn tại!`)
            throw err;
        }
        const { oldPassword, newPassword } = req.body
        await user.changePassword(oldPassword, newPassword)
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.json({ success: true, status: 'Change password successfully!' })
    } catch (error) {
        next(error)
    }
}