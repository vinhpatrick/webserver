const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const OrderStatistics = require('../models/orderStatistics')
const ProductStatistics = require('../models/productStatistics')
const Products = require('../models/products')


const getProductPriceStatistics = async (productId, from = moment().subtract(30, 'days'), to) => {
    const query = {
        product: productId,
        capturedTime: {
            $gte: from,
            ...(to && { $lte: to }),
        },
    }
    const statistics = await ProductStatistics.find(query).sort('capturedTime').lean()

    const formattedStatistics = statistics.map((item) => {
        const { capturedTime, ...rest } = item
        const formattedCapturedTime = moment(capturedTime).format('DD/MM/YYYY')
        return { ...rest, capturedTime: formattedCapturedTime }
    })

    if (statistics.length === 1) {
        const product = await Products.findById(statistics[0].product).lean()
        const { price } = product
        formattedStatistics.push({
            product: productId,
            price,
            capturedTime: moment().format('DD/MM/YYYY'),
        })
    }

    return formattedStatistics
}

exports.getProductPriceStatistics = async (req, res, next) => {
    try {
        const { id: productId, from, to } = { ...req.params, ...req.query }
        const statistics = await getProductPriceStatistics(productId, from, to)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(statistics)
    } catch (error) {
        next(error);
    }
}







const getOrderAmountStatistics = async ({
    userId,
    from = moment().subtract(30, 'days'),
    to,
}) => {
    const statistics = await OrderStatistics.aggregate([
        {
            $match: {//chọn document truy vấn
                ...(userId && { user: new ObjectId(userId) }),
                capturedTime: {
                    $gte: moment(from).toDate(),//trả về sao của ngày sử dụng
                    ...(to && { $lte: moment(to).toDate() }),
                },
            },
        },
        {
            $group: {//nhóm các document theo điều kiện
                _id: {
                    $dateToString: {
                        format: '%d/%m/%Y',
                        date: '$capturedTime',
                    },
                },
                totalAmount: {
                    $sum: '$amount',
                },
                orderCount: {
                    $sum: 1,
                },
            },
        },
        {
            $project: {//chỉ định các feild muốn truy vấn
                _id: 0,
                date: '$_id',
                totalAmount: 1,
                orderCount: 1,
            },
        },
        {
            $sort: {
                date: 1,
            },
        },
        {
            $group: {
                _id: null,
                statistics: {
                    $push: '$$ROOT',
                },
            },
        },
        {
            $addFields: {//them fields
                totalAmount: {
                    $sum: '$statistics.totalAmount',
                },
                orderCount: {
                    $sum: '$statistics.orderCount',
                },
            },
        },
        {
            $project: {
                _id: 0,
            },
        },

    ])

    return (statistics.length && statistics[0]) || {}
}
const getOrderAmountStatisticsByMonth = async ({
    userId,
    from,
    to,
}) => {
    const statistics = await OrderStatistics.aggregate([
        {
            $match: {//chọn document truy vấn
                ...(userId && { user: new ObjectId(userId) }),
                capturedTime: {
                    $gte: moment(from).toDate(),//trả về sao của ngày sử dụng
                    ...(to && { $lte: moment(to).toDate() }),
                },
            },
        },
        {
            $group: {//nhóm các document theo điều kiện
                _id: {
                    $dateToString: {
                        format: '%m/%Y',
                        date: '$capturedTime',
                    },
                },
                totalAmount: {
                    $sum: '$amount',
                },
                orderCount: {
                    $sum: 1,
                },
            },
        },
        {
            $project: {//chỉ định các feild muốn truy vấn
                _id: 0,
                date: '$_id',
                totalAmount: 1,
                orderCount: 1,
            },
        },
        {
            $sort: {
                date: 1,
            },
        },
        {
            $group: {
                _id: null,
                statistics: {
                    $push: '$$ROOT',
                },
            },
        },
        {
            $addFields: {//them fields
                totalAmount: {
                    $sum: '$statistics.totalAmount',
                },
                orderCount: {
                    $sum: '$statistics.orderCount',
                },
            },
        },
        {
            $project: {
                _id: 0,
            },
        },

    ])

    return (statistics.length && statistics[0]) || {}
}

exports.getOrderAmountStatisticsByMonth = async (req, res, next) => {
    try {
        // const timeOfMonth = moment().date()//lấy ngày của tháng hiện tại
        // const timeEnd = moment().subtract(timeOfMonth, 'days')
        // const timeStart = moment().subtract((timeOfMonth + 30), 'days')
        // console.log('timeStart', timeStart)
        // console.log('timeEnd', timeEnd)
        const timeStart = moment().month('January')
        const timeEnd = moment().month('December')
        console.log('timeStart', timeStart)
        console.log('timeEnd', timeEnd)


        const { userId } = { ...req.query, ...req.params }
        const statistics = await getOrderAmountStatisticsByMonth({
            userId,
            from: timeStart,
            to: timeEnd,
        })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(statistics);
    } catch (error) {
        return next(error);
    }
}
exports.getOrderAmountStatistics = async (req, res, next) => {
    try {
        const { from, to, userId } = { ...req.query, ...req.params }
        const statistics = await getOrderAmountStatistics({
            userId,
            from,
            to,
        })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(statistics);
    } catch (error) {
        return next(error)
    }
}