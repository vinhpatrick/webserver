const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const OrderStatistics = require('../models/orderStatistics')


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
    from = moment().subtract(30, 'days'),
    to,
}) => {
    const statistics = await OrderStatistics.aggregate([
        {
            $match: {
                // ...(userId && { user: new ObjectId(userId) }),
                capturedTime: {
                    $gte: moment(from).toDate(),
                    ...(to && { $lte: moment(to).toDate() }),
                },
            },
        },
        {
            $group: {
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
            $project: {
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
            $addFields: {
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


exports.getOrderAmountStatistics = async (req, res, next) => {
    try {
        const { from, to } = { ...req.query, ...req.params }
        const statistics = await getOrderAmountStatistics({
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